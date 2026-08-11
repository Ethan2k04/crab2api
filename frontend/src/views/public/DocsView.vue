<template>
  <PublicLayout>
    <div class="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <header class="max-w-2xl">
        <p class="mono-label">CRAB2API / DOCS</p>
        <h1 class="mt-3 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          {{ t('docsPage.title') }}
        </h1>
        <p class="mt-3 text-base text-gray-600 dark:text-dark-300">{{ t('docsPage.subtitle') }}</p>
      </header>

      <div class="mt-12 gap-12 lg:grid lg:grid-cols-[200px_1fr]">
        <!-- Table of contents -->
        <aside class="hidden lg:block">
          <nav class="sticky top-24">
            <p class="mono-label">{{ t('docsPage.onThisPage') }}</p>
            <ul class="mt-3 space-y-1.5 border-l border-gray-200 dark:border-dark-700">
              <li v-for="section in sections" :key="section.id">
                <a
                  :href="`#${section.id}`"
                  class="-ml-px block border-l-2 border-transparent py-1 pl-3 text-sm text-gray-600 transition-colors hover:border-primary-500 hover:text-primary-600 dark:text-dark-300 dark:hover:text-primary-400"
                >
                  {{ section.label }}
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        <div class="min-w-0 space-y-16">
          <!-- Quickstart -->
          <section id="quickstart" class="scroll-mt-24">
            <h2 class="doc-h2">{{ t('docsPage.quickstart.title') }}</h2>
            <ol class="mt-6 space-y-5">
              <li v-for="(step, idx) in quickstartSteps" :key="step.key" class="flex gap-4">
                <span
                  class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-500 font-mono text-xs font-semibold text-white"
                >
                  {{ idx + 1 }}
                </span>
                <div class="min-w-0">
                  <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                    {{ step.title }}
                  </h3>
                  <p class="mt-1 text-sm leading-relaxed text-gray-600 dark:text-dark-400">
                    {{ step.desc }}
                  </p>
                </div>
              </li>
            </ol>
          </section>

          <!-- Endpoints -->
          <section id="endpoints" class="scroll-mt-24">
            <h2 class="doc-h2">{{ t('docsPage.endpoints.title') }}</h2>
            <p class="doc-p">{{ t('docsPage.endpoints.desc') }}</p>

            <dl class="mt-6 overflow-hidden rounded-xl border border-gray-200 dark:border-dark-700">
              <div
                v-for="row in endpointRows"
                :key="row.label"
                class="flex flex-col gap-1 border-b border-gray-200 px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:gap-6 dark:border-dark-700"
              >
                <dt class="w-64 shrink-0 text-sm font-medium text-gray-900 dark:text-white">
                  {{ row.label }}
                </dt>
                <dd class="min-w-0 flex-1">
                  <code class="break-all font-mono text-[13px] text-primary-600 dark:text-primary-400">
                    {{ row.value }}
                  </code>
                </dd>
              </div>
            </dl>

            <h3 class="doc-h3">{{ t('docsPage.endpoints.auth') }}</h3>
            <p class="doc-p">{{ t('docsPage.endpoints.authDesc') }}</p>
          </section>

          <!-- Client setup -->
          <section id="clients" class="scroll-mt-24">
            <h2 class="doc-h2">{{ t('docsPage.clients.title') }}</h2>

            <h3 class="doc-h3">{{ t('docsPage.clients.claudeCode.title') }}</h3>
            <p class="doc-p">{{ t('docsPage.clients.claudeCode.desc') }}</p>

            <!-- Session-scoped: the variables live only in the current shell. -->
            <h4 class="doc-h4">{{ t('docsPage.clients.claudeCode.sessionTitle') }}</h4>
            <p class="doc-p">{{ t('docsPage.clients.claudeCode.sessionDesc') }}</p>
            <div class="mt-3 space-y-4">
              <div v-for="s in sessionShells" :key="s.key">
                <p class="mono-label mb-1.5">{{ s.label }}</p>
                <CodeBlock :label="s.lang" :code="s.code" />
              </div>
            </div>

            <!-- Persistent: survives a new terminal / reboot. -->
            <h4 class="doc-h4">{{ t('docsPage.clients.claudeCode.persistTitle') }}</h4>
            <p class="doc-p">{{ t('docsPage.clients.claudeCode.persistDesc') }}</p>
            <div class="mt-3 space-y-4">
              <div v-for="s in persistShells" :key="s.key">
                <p class="mono-label mb-1.5">{{ s.label }}</p>
                <CodeBlock :label="s.lang" :code="s.code" />
                <p v-if="s.note" class="mt-1.5 text-xs text-gray-500 dark:text-dark-400">{{ s.note }}</p>
              </div>
            </div>

            <h3 class="doc-h3">{{ t('docsPage.clients.curl.title') }}</h3>
            <p class="doc-p">{{ t('docsPage.clients.curl.desc') }}</p>
            <CodeBlock class="mt-3" label="bash" :code="snippets.curl" />

            <h3 class="doc-h3">{{ t('docsPage.clients.python.title') }}</h3>
            <p class="doc-p">{{ t('docsPage.clients.python.desc') }}</p>
            <CodeBlock class="mt-3" label="python" :code="snippets.python" />

            <h3 class="doc-h3">{{ t('docsPage.clients.node.title') }}</h3>
            <p class="doc-p">{{ t('docsPage.clients.node.desc') }}</p>
            <CodeBlock class="mt-3" label="typescript" :code="snippets.node" />

            <h3 class="doc-h3">{{ t('docsPage.clients.thirdParty.title') }}</h3>
            <p class="doc-p">{{ t('docsPage.clients.thirdParty.desc') }}</p>
          </section>

          <!-- Models -->
          <section id="models" class="scroll-mt-24">
            <h2 class="doc-h2">{{ t('docsPage.models.title') }}</h2>
            <p class="doc-p">{{ t('docsPage.models.desc') }}</p>

            <div class="mt-5 overflow-x-auto rounded-xl border border-gray-200 dark:border-dark-700">
              <table class="w-full min-w-[520px] text-left text-sm">
                <thead class="border-b border-gray-200 bg-gray-50 dark:border-dark-700 dark:bg-dark-800">
                  <tr>
                    <th class="px-4 py-2.5 font-medium text-gray-500 dark:text-dark-300">
                      {{ t('docsPage.models.colId') }}
                    </th>
                    <th class="px-4 py-2.5 font-medium text-gray-500 dark:text-dark-300">
                      {{ t('docsPage.models.colName') }}
                    </th>
                    <th class="px-4 py-2.5 font-medium text-gray-500 dark:text-dark-300">
                      {{ t('docsPage.models.colTier') }}
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-dark-700">
                  <tr v-for="model in models" :key="model.id">
                    <td class="px-4 py-2.5">
                      <code class="font-mono text-[13px] text-primary-600 dark:text-primary-400">
                        {{ model.id }}
                      </code>
                    </td>
                    <td class="px-4 py-2.5 text-gray-900 dark:text-white">{{ model.label }}</td>
                    <td class="px-4 py-2.5 text-gray-500 dark:text-dark-400">
                      {{ t(`landing.models.tier.${model.tier}`) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Errors -->
          <section id="errors" class="scroll-mt-24">
            <h2 class="doc-h2">{{ t('docsPage.errors.title') }}</h2>
            <p class="doc-p">{{ t('docsPage.errors.desc') }}</p>

            <dl class="mt-5 overflow-hidden rounded-xl border border-gray-200 dark:border-dark-700">
              <div
                v-for="row in errorRows"
                :key="row.code"
                class="flex flex-col gap-1 border-b border-gray-200 px-4 py-3 last:border-b-0 sm:flex-row sm:gap-6 dark:border-dark-700"
              >
                <dt class="w-20 shrink-0">
                  <code class="font-mono text-[13px] font-semibold text-primary-600 dark:text-primary-400">
                    {{ row.code }}
                  </code>
                </dt>
                <dd class="text-sm text-gray-600 dark:text-dark-300">{{ row.desc }}</dd>
              </div>
            </dl>
          </section>

          <!-- Help -->
          <section id="help" class="scroll-mt-24">
            <h2 class="doc-h2">{{ t('docsPage.help.title') }}</h2>
            <p class="doc-p">{{ t('docsPage.help.desc') }}</p>
            <router-link
              to="/dashboard"
              class="mt-5 inline-flex h-10 items-center gap-2 rounded-xl bg-primary-500 px-5 text-sm font-medium text-white transition-colors hover:bg-primary-600"
            >
              {{ t('docsPage.help.cta') }}
              <Icon name="arrowRight" size="sm" />
            </router-link>
          </section>
        </div>
      </div>
    </div>
  </PublicLayout>
</template>

<script setup lang="ts">
/**
 * Public documentation, served at `/docs` (English) and `/zh/docs` (Chinese).
 *
 * The base URL in every snippet comes from the `api_base_url` public setting
 * when the operator has configured one, so copied examples work against the
 * deployment the visitor is actually looking at.
 */
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import PublicLayout from '@/components/public/PublicLayout.vue'
import CodeBlock from '@/components/public/CodeBlock.vue'
import Icon from '@/components/icons/Icon.vue'
import { useAppStore } from '@/stores'
import {
  ADVERTISED_MODELS,
  ANTHROPIC_ENDPOINT,
  DEFAULT_API_BASE_URL,
  OPENAI_ENDPOINT
} from '@/config/brand'

const { t } = useI18n()
const appStore = useAppStore()

const models = ADVERTISED_MODELS

/** Operator-configured base URL wins; otherwise fall back to the brand default. */
const baseUrl = computed(() => {
  const configured = (appStore.cachedPublicSettings?.api_base_url || appStore.apiBaseUrl || '').trim()
  return (configured || DEFAULT_API_BASE_URL).replace(/\/+$/, '')
})

const sections = computed(() => [
  { id: 'quickstart', label: t('docsPage.quickstart.title') },
  { id: 'endpoints', label: t('docsPage.endpoints.title') },
  { id: 'clients', label: t('docsPage.clients.title') },
  { id: 'models', label: t('docsPage.models.title') },
  { id: 'errors', label: t('docsPage.errors.title') },
  { id: 'help', label: t('docsPage.help.title') }
])

const quickstartSteps = computed(() =>
  (['step1', 'step2', 'step3', 'step4'] as const).map((key) => ({
    key,
    title: t(`docsPage.quickstart.${key}.title`),
    desc: t(`docsPage.quickstart.${key}.desc`)
  }))
)

const endpointRows = computed(() => [
  { label: t('docsPage.endpoints.baseUrl'), value: baseUrl.value },
  { label: t('docsPage.endpoints.anthropic'), value: `POST ${baseUrl.value}${ANTHROPIC_ENDPOINT}` },
  { label: t('docsPage.endpoints.openai'), value: `POST ${baseUrl.value}${OPENAI_ENDPOINT}` }
])

const errorRows = computed(() => [
  { code: '401', desc: t('docsPage.errors.col401') },
  { code: '403', desc: t('docsPage.errors.col403') },
  { code: '429', desc: t('docsPage.errors.col429') },
  { code: '5xx', desc: t('docsPage.errors.col5xx') }
])

const SAMPLE_KEY = 'sk-crab-xxxxxxxxxxxx'

/**
 * Session-scoped setup: the variables exist only in the shell you typed them
 * into. Closing the terminal discards them — that is the point, and it is why
 * this is the safer default for trying a key out.
 */
const sessionShells = computed(() => [
  {
    key: 'unix',
    label: 'macOS / Linux (bash · zsh)',
    lang: 'bash',
    code: `export ANTHROPIC_BASE_URL="${baseUrl.value}"
export ANTHROPIC_AUTH_TOKEN="${SAMPLE_KEY}"

claude`
  },
  {
    key: 'cmd',
    label: 'Windows CMD',
    lang: 'bat',
    // No quotes: cmd would take them as part of the value.
    code: `set ANTHROPIC_BASE_URL=${baseUrl.value}
set ANTHROPIC_AUTH_TOKEN=${SAMPLE_KEY}

claude`
  },
  {
    key: 'powershell',
    label: 'Windows PowerShell',
    lang: 'powershell',
    code: `$env:ANTHROPIC_BASE_URL = "${baseUrl.value}"
$env:ANTHROPIC_AUTH_TOKEN = "${SAMPLE_KEY}"

claude`
  }
])

/**
 * Persistent setup: survives new terminals and reboots. Each snippet writes to
 * the place that shell actually reads at startup, then reloads it so the
 * current session picks the values up without reopening the terminal.
 */
const persistShells = computed(() => [
  {
    key: 'unix',
    label: 'macOS / Linux (bash · zsh)',
    lang: 'bash',
    code: `# bash: ~/.bashrc  |  zsh: ~/.zshrc  |  macOS default shell is zsh
cat >> ~/.zshrc <<'EOF'
export ANTHROPIC_BASE_URL="${baseUrl.value}"
export ANTHROPIC_AUTH_TOKEN="${SAMPLE_KEY}"
EOF

source ~/.zshrc`,
    note: t('docsPage.clients.claudeCode.noteUnix')
  },
  {
    key: 'cmd',
    label: 'Windows CMD',
    lang: 'bat',
    code: `setx ANTHROPIC_BASE_URL "${baseUrl.value}"
setx ANTHROPIC_AUTH_TOKEN "${SAMPLE_KEY}"`,
    note: t('docsPage.clients.claudeCode.noteSetx')
  },
  {
    key: 'powershell',
    label: 'Windows PowerShell',
    lang: 'powershell',
    code: `[Environment]::SetEnvironmentVariable('ANTHROPIC_BASE_URL', '${baseUrl.value}', 'User')
[Environment]::SetEnvironmentVariable('ANTHROPIC_AUTH_TOKEN', '${SAMPLE_KEY}', 'User')`,
    note: t('docsPage.clients.claudeCode.notePwsh')
  }
])

const snippets = computed(() => ({

  curl: `curl ${baseUrl.value}${ANTHROPIC_ENDPOINT} \\
  -H "x-api-key: sk-crab-xxxxxxxxxxxx" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d '{
    "model": "claude-sonnet-4-5",
    "max_tokens": 256,
    "messages": [{ "role": "user", "content": "Hello, Crab2API!" }]
  }'`,

  python: `from anthropic import Anthropic

client = Anthropic(
    base_url="${baseUrl.value}",
    api_key="sk-crab-xxxxxxxxxxxx",
)

message = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=256,
    messages=[{"role": "user", "content": "Hello, Crab2API!"}],
)
print(message.content[0].text)`,

  node: `import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  baseURL: '${baseUrl.value}',
  apiKey: 'sk-crab-xxxxxxxxxxxx',
})

const message = await client.messages.create({
  model: 'claude-sonnet-4-5',
  max_tokens: 256,
  messages: [{ role: 'user', content: 'Hello, Crab2API!' }],
})
console.log(message.content[0])`
}))

onMounted(() => {
  if (!appStore.publicSettingsLoaded) {
    appStore.fetchPublicSettings()
  }
})
</script>

<style scoped>
.doc-h2 {
  @apply border-b border-gray-200 pb-3 text-2xl font-bold tracking-tight text-gray-900 dark:border-dark-700 dark:text-white;
}
.doc-h3 {
  @apply mt-8 text-base font-semibold text-gray-900 dark:text-white;
}
.doc-h4 {
  @apply mt-6 text-sm font-semibold text-gray-800 dark:text-dark-100;
}
.doc-p {
  @apply mt-2 max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-dark-300;
}
</style>
