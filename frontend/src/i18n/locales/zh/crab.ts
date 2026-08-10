/**
 * Crab2API 公开站点文案（中文）。
 * 覆盖站点通用框架、落地页与文档页。
 */
export default {
  // ==================== 站点通用框架 ====================
  siteNav: {
    brandName: 'Crab2API',
    brandTagline: '纯血 Claude 中转站',
    mainPage: '主页',
    console: '控制台',
    docs: '文档',
    login: '登录',
    dashboard: '控制台',
    language: '语言',
    theme: '主题',
    lightMode: '日间模式',
    darkMode: '夜间模式',
    openMenu: '打开菜单',
    closeMenu: '关闭菜单',
    skipToContent: '跳到正文',
    backToHome: '返回主页',
    roleAdmin: '管理员',
    roleUser: '用户'
  },

  notFound: {
    code: '404',
    title: '页面不存在',
    description: '你访问的页面不存在,或者已经被移动了。',
    backToHome: '返回主页',
    goBack: '返回上一页',
    goToConsole: '进入控制台',
    readDocs: '查看文档'
  },

  siteFooter: {
    tagline: '只中转纯血 Claude 模型。',
    product: '产品',
    resources: '资源',
    legal: '条款',
    pricing: '订阅套餐',
    models: '可用模型',
    faq: '常见问题',
    quickstart: '快速开始',
    apiReference: '接口说明',
    terms: '服务条款',
    privacy: '隐私政策',
    allRightsReserved: '保留所有权利。',
    notAffiliated:
      'Crab2API 是独立的中转服务，与 Anthropic 无隶属、认可或赞助关系。'
  },

  // ==================== 落地页 ====================
  landing: {
    meta: {
      title: 'Crab2API — 纯血 Claude 模型中转站',
      description:
        'Crab2API 只中转纯血 Claude 模型。兼容 Anthropic 接口，用量透明，一把 Key 通吃 Claude Code 与各类 Anthropic 客户端。'
    },

    hero: {
      eyebrow: 'CRAB2API / CLAUDE 中转',
      titleLine1: '一把 Key。',
      titleLine2: '纯血 Claude。',
      slogan: '只中转纯血 Claude 模型！',
      description:
        '没有套着 Claude 名字的第三方模型，也不会在你看不见的地方偷偷降级。每一次请求都落在真实的 Anthropic 上游，用量、Token 与费用逐条可查。',
      ctaPrimary: '开始使用',
      ctaSecondary: '查看文档',
      badges: {
        oneKey: '一把 API Key',
        claudeOnly: '只有 Claude 模型',
        anthropicCompatible: '兼容 Anthropic 接口'
      }
    },

    demo: {
      label: '演示',
      request: '请求',
      response: '响应',
      client: '客户端',
      gateway: '网关',
      upstream: '上游',
      yourApp: '你的应用',
      routing: '路由',
      status: '状态',
      latency: '延迟',
      tokens: 'Token',
      model: '模型',
      verified: '已验证上游'
    },

    features: {
      title: '为什么选择 Crab2API',
      subtitle: '写给在意「到底是谁回答了这次请求」的人。',
      items: {
        authentic: {
          title: '只有纯血 Claude',
          desc: '每个上游账号都是真实的 Anthropic 订阅。没有第三方镜像，没有微调的仿制模型，更不会拿别家模型冒充 Claude。'
        },
        noSwap: {
          title: '绝不偷偷换模型',
          desc: '你请求哪个模型，就由哪个模型应答。模型不可用时直接报错，而不是悄悄降级到更便宜的那个。'
        },
        compatible: {
          title: '零改造接入',
          desc: '兼容 Anthropic 接口，可直接用于 Claude Code、官方 SDK、Cherry Studio 等任何支持 /v1/messages 的客户端。只改 Base URL，代码不动。'
        },
        transparent: {
          title: '账目透明',
          desc: '逐条记录状态、延迟、输入/输出 Token、缓存命中与费用，可导出核对，不做四舍五入的糊涂账。'
        },
        sticky: {
          title: '会话保持',
          desc: '多轮对话固定在同一个上游账号上，让提示词缓存持续生效，上下文不掉温。'
        },
        resilient: {
          title: '池化与容灾',
          desc: '带健康检查的账号池吸收限流与上游抖动。故障转移只在同一模型档位内进行，绝不跨档降级。'
        }
      }
    },

    models: {
      title: '可用模型',
      subtitle: '完整的纯血 Claude 阵容，仅此而已。',
      tier: {
        flagship: '旗舰',
        balanced: '均衡',
        fast: '轻快'
      },
      note: '模型可用性跟随 Anthropic 上游。Claude 新版本在上游账号开放后会第一时间上架。'
    },

    pricing: {
      title: '订阅套餐',
      subtitle: '选好额度，拿到 Key，直接开用。没有隐藏的按人头收费。',
      livePlans: '实时价格',
      fallbackNotice: '此处为参考价格，请登录控制台查看当前账号可购买的套餐。',
      perPeriodDays: '每 {days} 天',
      perDay: '每天',
      mostPopular: '最受欢迎',
      choosePlan: '选择套餐',
      viewInConsole: '在控制台查看',
      loading: '正在加载套餐…',
      empty: '当前没有在售套餐，请稍后再来。',
      quotaLabel: '额度',
      modelsLabel: '可用模型',
      allClaudeModels: '全部 Claude 模型',
      unlimited: '不限量',
      currencyNote: '价格以 {currency} 计。',
      plans: {
        starter: {
          name: '入门版',
          desc: '适合先试用服务、日常轻度使用。',
          features: {
            f1: '可用 Claude Haiku 与 Sonnet',
            f2: '标准并发',
            f3: '完整用量记录',
            f4: '社区支持'
          }
        },
        pro: {
          name: '专业版',
          desc: '适合每天用 Claude Code 写代码、跑 Agent 工作流。',
          features: {
            f1: '全部 Claude 模型，含 Opus',
            f2: '更高并发与优先路由',
            f3: '会话保持 + 提示词缓存',
            f4: '用量导出与费用明细'
          }
        },
        max: {
          name: '旗舰版',
          desc: '适合团队长期跑高强度负载。',
          features: {
            f1: '全部 Claude 模型，最高优先级',
            f2: '最大并发，专属账号池',
            f3: '多把 API Key，可分别设额度',
            f4: '优先支持通道'
          }
        }
      }
    },

    faq: {
      title: '常见问题',
      subtitle: '下单之前，大家真正会问的那些问题。',
      items: {
        pureBlood: {
          q: '「纯血 Claude」到底是什么意思？',
          a: '每次请求都由真实的 Anthropic 账号应答。我们不会转发给第三方分销商、逆向接口，也不会让别家模型顶着 Claude 的模型名出现。你请求 claude-opus-4-6，就是 Anthropic 上游在回答。'
        },
        compatibility: {
          q: '我现有的代码还能用吗？',
          a: '只要走 Anthropic Messages 接口就能直接用。把 Base URL 指向 Crab2API，把 Anthropic Key 换成 Crab2API Key 即可。Claude Code、官方 SDK 和大多数桌面客户端都不需要额外改动。'
        },
        billing: {
          q: '用量是怎么算的？',
          a: '按请求计费，依据上游返回的输入/输出 Token，缓存读取与缓存写入分开列示。每一次调用都会在用量记录里出现，附带状态、延迟与费用。'
        },
        limits: {
          q: '额度用完会怎样？',
          a: '会返回明确的额度错误，而不是降级到更弱的模型。你可以在控制台续费或升级，Key 立即恢复可用。'
        },
        privacy: {
          q: '你们会保存我的提示词吗？',
          a: '出于计费与排障需要，会保存请求元数据（模型、Token、延迟、状态）。提示词内容记录默认关闭，仅在运营方显式开启审计时才会生效。'
        },
        refund: {
          q: '可以退款吗？',
          a: '订阅未使用的部分可按服务条款退款。请在控制台提交工单并附上订单号。'
        }
      }
    },

    cta: {
      title: '准备好和真正的 Claude 对话了吗？',
      description: '一分钟内创建一把 Key，把客户端指向 Crab2API 即可开始。',
      primary: '开始使用',
      secondary: '查看文档'
    }
  },

  // ==================== 文档页 ====================
  docsPage: {
    meta: {
      title: '文档 — Crab2API',
      description: 'Crab2API Claude 中转站的快速开始、接口说明、客户端配置与常见问题。'
    },
    title: '文档',
    subtitle: '发出第一个请求所需的全部内容。',
    onThisPage: '本页目录',
    copy: '复制',
    copied: '已复制',
    copyFailed: '复制失败',

    quickstart: {
      title: '快速开始',
      step1: {
        title: '注册账号',
        desc: '注册并登录控制台，新账号默认进入免费档。'
      },
      step2: {
        title: '创建 API Key',
        desc: '在控制台的「API 密钥」页面创建 Key。请立即复制保存——完整 Key 只在创建时展示一次。'
      },
      step3: {
        title: '把客户端指向 Crab2API',
        desc: '把 Anthropic 的 Base URL 换成 Crab2API 的 Base URL，凭据改用你的 Crab2API Key。'
      },
      step4: {
        title: '发出请求',
        desc: '此后任何 Anthropic Messages 接口调用都无需改动。'
      }
    },

    endpoints: {
      title: '接口地址',
      desc: 'Crab2API 提供兼容 Anthropic 的接口；对于只支持 OpenAI 方言的客户端，也提供兼容 OpenAI 的接口。',
      baseUrl: 'Base URL',
      anthropic: 'Anthropic Messages 接口',
      openai: '兼容 OpenAI 的 Chat Completions 接口',
      auth: '鉴权方式',
      authDesc:
        '可用 `x-api-key`（Anthropic 风格）或 `Authorization: Bearer <key>`（OpenAI 风格）传递 Key，两种方式在各自的接口上都被接受。'
    },

    clients: {
      title: '客户端配置',
      claudeCode: {
        title: 'Claude Code',
        desc: '设置两个环境变量，然后照常运行 `claude`。'
      },
      curl: {
        title: 'curl',
        desc: '最小可用请求，适合用来验证 Key 是否生效。'
      },
      python: {
        title: 'Python SDK',
        desc: '官方 `anthropic` 包支持自定义 Base URL。'
      },
      node: {
        title: 'Node SDK',
        // 注意：消息文本中不要出现 "@"，vue-i18n 会当成链接消息语法解析。
        desc: '官方 Anthropic Node SDK 同理。'
      },
      thirdParty: {
        title: '桌面客户端',
        desc: '在 Cherry Studio、ChatBox 等工具中选择 Claude / Anthropic 供应商，把 API 地址改成 Crab2API 的 Base URL，再粘贴你的 Key 即可。'
      }
    },

    models: {
      title: '模型列表',
      desc: '请严格按列出的模型 ID 调用。未知 ID 会被拒绝，而不会被静默改写成别的模型。',
      colId: '模型 ID',
      colName: '名称',
      colTier: '档位'
    },

    errors: {
      title: '错误码',
      desc: '错误结构与 Anthropic 保持一致，现有重试逻辑可以直接复用。',
      col401: 'API Key 无效或缺失。',
      col403: 'Key 有效，但无权使用该模型或分组。',
      col429: '额度耗尽或触发限流，请在控制台检查套餐。',
      col5xx: '上游故障。该请求不计费，请退避后重试。'
    },

    faq: {
      title: '常见问题',
      more: '更多答案见主页。'
    },

    help: {
      title: '还是没解决？',
      desc: '打开控制台使用支持入口，或在用量记录中查找失败请求的 request id。',
      cta: '打开控制台'
    }
  }
}
