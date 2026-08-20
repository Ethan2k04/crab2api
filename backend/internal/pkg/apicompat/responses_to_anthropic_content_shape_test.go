package apicompat

import (
	"encoding/json"
	"strings"
	"testing"

	"github.com/stretchr/testify/require"
)

// Anthropic 的 messages[].content 只接受「字符串」或「block 数组」。发出对象、
// 数字、布尔或 null，上游一律回 400
// "messages.N.content: Input should be a valid array"。
//
// 这条报错在生产上由 Codex CLI 触发：/v1/responses 进来的长会话里只要有一条
// item 的 content 形态不标准，转换器以前就会把它原样透传进 Anthropic 请求体，
// 整轮请求被上游打挂且不可重试。
func requireEveryContentIsStringOrArray(t *testing.T, messages []AnthropicMessage) {
	t.Helper()
	for i, m := range messages {
		raw := strings.TrimSpace(string(m.Content))
		require.NotEqual(t, "null", raw, "messages[%d].content 不能是 null", i)

		var s string
		if err := json.Unmarshal(m.Content, &s); err == nil {
			require.NotEmpty(t, strings.TrimSpace(s), "messages[%d].content 字符串不能为空", i)
			continue
		}
		var elems []json.RawMessage
		require.NoError(t, json.Unmarshal(m.Content, &elems),
			"messages[%d].content 既不是字符串也不是数组：%s", i, raw)
		require.NotEmpty(t, elems, "messages[%d].content 数组不能为空", i)
	}
}

// content 写成单个分片对象（没包成数组）——以前原样透传，现在按单元素分片收下。
func TestResponsesToAnthropic_ContentObjectIsWrappedNotPassedThrough(t *testing.T) {
	messages := responsesToAnthropicMessages(t, `[
		{"type":"message","role":"user","content":{"type":"input_text","text":"hi"}},
		{"type":"message","role":"assistant","content":{"type":"output_text","text":"yo"}}
	]`)

	requireEveryContentIsStringOrArray(t, messages)
	requireAnthropicMessagesAreSendable(t, messages)
	require.Len(t, messages, 2)
	require.Contains(t, string(messages[0].Content), "hi")
	require.Contains(t, string(messages[1].Content), "yo")
}

// 两条相邻同角色消息的内容都解析不出 block 时，合并会走
// json.Marshal(nil) 写出 content:null——同样被上游按数组校验拒掉。
func TestResponsesToAnthropic_ConsecutiveObjectContentsNeverMergeToNull(t *testing.T) {
	messages := responsesToAnthropicMessages(t, `[
		{"type":"message","role":"user","content":{"type":"input_text","text":"a"}},
		{"type":"message","role":"user","content":{"type":"input_text","text":"b"}}
	]`)

	requireEveryContentIsStringOrArray(t, messages)
	require.Len(t, messages, 1, "同角色消息应合并为一条")
	require.Contains(t, string(messages[0].Content), "a")
	require.Contains(t, string(messages[0].Content), "b")
}

// 标量 content 无法映射成任何 block，整条消息丢掉即可，绝不能透传。
func TestResponsesToAnthropic_ScalarContentIsDropped(t *testing.T) {
	for _, content := range []string{`123`, `true`, `null`} {
		messages := responsesToAnthropicMessages(t,
			`[{"type":"message","role":"user","content":`+content+`}]`)
		requireEveryContentIsStringOrArray(t, messages)
		require.Empty(t, messages, "content=%s 应整条丢弃", content)
	}
}

// 数组里混着解析不了的元素时，逐个元素处理：坏的丢掉，好的留下，
// 而不是整条放弃后把原始数组透传出去。
func TestResponsesToAnthropic_MalformedPartsAreDroppedIndividually(t *testing.T) {
	messages := responsesToAnthropicMessages(t, `[
		{"type":"message","role":"user","content":[
			{"type":"input_text","text":"keep me"},
			{"type":"input_text","text":{"nested":"broken"}},
			{"type":"input_image","image_url":{"url":"data:image/png;base64,AAA"}}
		]}
	]`)

	requireEveryContentIsStringOrArray(t, messages)
	requireAnthropicMessagesAreSendable(t, messages)
	require.Len(t, messages, 1)
	require.Contains(t, string(messages[0].Content), "keep me")
	require.NotContains(t, string(messages[0].Content), "nested")
	require.NotContains(t, string(messages[0].Content), "image_url")
}

// 数组元素直接是字符串（而非分片对象）时按纯文本收下。
func TestResponsesToAnthropic_BareStringPartBecomesText(t *testing.T) {
	messages := responsesToAnthropicMessages(t, `[
		{"type":"message","role":"user","content":["hello"]}
	]`)

	requireEveryContentIsStringOrArray(t, messages)
	requireAnthropicMessagesAreSendable(t, messages)
	require.Len(t, messages, 1)
	require.Contains(t, string(messages[0].Content), "hello")
}

func TestAnthropicContentIsSendable(t *testing.T) {
	cases := []struct {
		raw  string
		want bool
	}{
		{`"hi"`, true},
		{`[{"type":"text","text":"hi"}]`, true},
		{``, false},
		{`null`, false},
		{`""`, false},
		{`"   "`, false},
		{`[]`, false},
		{`{"type":"input_text","text":"hi"}`, false},
		{`123`, false},
		{`true`, false},
	}
	for _, tc := range cases {
		require.Equal(t, tc.want, anthropicContentIsSendable(json.RawMessage(tc.raw)), "raw=%q", tc.raw)
	}
}
