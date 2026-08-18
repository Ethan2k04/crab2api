/**
 * Crab2API public site copy (English).
 * Covers the shared site chrome, the landing page and the docs page.
 */
export default {
  // ==================== Shared site chrome ====================
  siteNav: {
    brandName: 'Crab2API',
    brandTagline: 'Pure-blood Claude relay',
    mainPage: 'Main Page',
    console: 'Console',
    docs: 'Docs',
    login: 'Login',
    dashboard: 'Console',
    language: 'Language',
    theme: 'Theme',
    lightMode: 'Light mode',
    darkMode: 'Dark mode',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    skipToContent: 'Skip to content',
    backToHome: 'Back to home',
    roleAdmin: 'Admin',
    roleUser: 'User'
  },

  notFound: {
    code: '404',
    title: 'Page not found',
    description: "The page you are looking for doesn't exist, or has moved.",
    backToHome: 'Back to home',
    goBack: 'Go back',
    goToConsole: 'Open console',
    readDocs: 'Read the docs'
  },

  siteFooter: {
    tagline: 'Only pure blood Claude models.',
    product: 'Product',
    resources: 'Resources',
    legal: 'Legal',
    pricing: 'Pricing',
    models: 'Models',
    faq: 'FAQ',
    quickstart: 'Quickstart',
    apiReference: 'API Reference',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
    allRightsReserved: 'All rights reserved.',
    notAffiliated:
      'Crab2API is an independent relay service. Not affiliated with, endorsed by, or sponsored by Anthropic.'
  },

  // ==================== Landing page ====================
  landing: {
    meta: {
      title: 'Crab2API — Pure-blood Claude model relay',
      description:
        'Crab2API relays authentic Claude models only. Anthropic-compatible API, transparent usage, one key for Claude Code and every Anthropic SDK client.'
    },

    hero: {
      eyebrow: 'CRAB2API / CLAUDE RELAY',
      titleLine1: 'One key.',
      titleLine2: 'Pure-blood Claude.',
      slogan: 'Only pure blood Claude models!',
      description:
        'No proxies dressed up as Claude. No silent model swaps. Every request lands on a genuine Anthropic upstream — with real-time usage, token counts and cost visible per call.',
      ctaPrimary: 'Get Started',
      ctaSecondary: 'Read the Docs',
      badges: {
        oneKey: 'One API Key',
        claudeOnly: 'Claude models only',
        anthropicCompatible: 'Anthropic-compatible'
      }
    },

    // Claude Code demo terminal in the hero. `prompts` are typed out in order
    // and follow the page language — keep the key set in step with PROMPT_KEYS
    // in ClaudeCodeTerminal.vue.
    terminal: {
      cwd: '~/projects/my-app',
      connected: 'Connected to Crab2API',
      hint: '? for shortcuts',
      working: 'Thinking',
      done: 'Done',
      doneDetail: 'Routed through Crab2API to an Anthropic upstream',
      crabCoding: 'The crab is writing code',
      crabIdle: 'The crab is idle',
      crabYawning: 'The crab yawns',
      crabThinking: 'The crab is thinking',
      prompts: {
        p1: 'Compare the annualised return of DCA into the Nasdaq vs the S&P 500',
        p2: 'Design a minimal project page for this repo',
        p3: 'Add a job that pushes new releases to my Telegram channel',
        p4: 'Research LLM distillation and write it up as a .md report',
        p5: 'Fix the flaky 401 on the login endpoint and add a regression test'
      }
    },

    features: {
      title: 'Why Crab2API',
      subtitle: 'Built for people who care which model actually answered.',
      items: {
        authentic: {
          title: 'Authentic Claude only',
          desc: 'Every upstream account is a genuine Anthropic subscription. No third-party mirrors, no fine-tuned lookalikes, no OpenAI-behind-a-Claude-name.'
        },
        noSwap: {
          title: 'No silent model swaps',
          desc: 'The model you request is the model you get. If a model is unavailable, the request fails loudly instead of falling back to something cheaper.'
        },
        compatible: {
          title: 'Drop-in compatible',
          desc: 'Anthropic-compatible endpoints work with Claude Code, the official SDKs, Cherry Studio, and anything that speaks /v1/messages. Change the base URL, keep the code.'
        },
        transparent: {
          title: 'Transparent accounting',
          desc: 'Per-request status, latency, input/output tokens, cache hits and cost. Exportable records, no rounded-up mystery billing.'
        },
        sticky: {
          title: 'Session stickiness',
          desc: 'Multi-turn conversations stay pinned to the same upstream account, so prompt caching keeps working and context stays warm.'
        },
        resilient: {
          title: 'Pooled and resilient',
          desc: 'A health-checked account pool absorbs rate limits and upstream hiccups. Failover happens within the same model tier — never across it.'
        }
      }
    },

    // The landing page swapped its model list for "what Claude Code can do";
    // `tier` stays because the docs page's model table still uses it.
    models: {
      tier: {
        flagship: 'Flagship',
        balanced: 'Balanced',
        fast: 'Fast'
      }
    },

    useCases: {
      title: 'What you can do with Claude Code',
      subtitle: 'Not just autocomplete — hand over the whole job, from research to shipped code.',
      items: {
        data: {
          title: 'Data & financial analysis',
          desc: 'It pulls the data, writes and runs the script, plots the chart, then explains what the numbers actually mean.',
          examples: {
            e1: 'Compare the annualised return of DCA into the Nasdaq vs the S&P 500',
            e2: 'Chart quarterly revenue from this CSV and flag the outlier months'
          }
        },
        build: {
          title: 'Design & build projects',
          desc: 'From one sentence to working code: it reads your existing project, writes the implementation, adds tests, and iterates until they pass.',
          examples: {
            e1: 'Design a minimal, clean project page for this repo',
            e2: 'Add a job that pushes new releases to my Telegram channel'
          }
        },
        research: {
          title: 'Research & literature review',
          desc: 'Searches the web for current papers, cross-checks sources against each other, and writes it up as a structured report with citations.',
          examples: {
            e1: 'Research LLM distillation, find recent papers, and write a .md report',
            e2: 'Compare the experimental setups in these three papers and list where they disagree'
          }
        }
      },
      note: 'These are typical Claude Code workflows. This site only forwards your requests, unmodified, to a genuine Anthropic upstream — which client you use and what you build with it is entirely up to you.'
    },

    pricing: {
      title: 'Subscription plans',
      subtitle: 'Pick a quota, get a key, start calling. No hidden per-seat fees.',
      fallbackNotice:
        'Indicative pricing — sign in to the console for the current plans available to your account.',
      perPeriodDays: '{days} days',
      per24h: '24 hours',
      mostPopular: 'Most popular',
      choosePlan: 'Choose plan',
      viewInConsole: 'View in console',
      loading: 'Loading plans…',
      empty: 'No plans are on sale right now. Please check back soon.',
      quotaLabel: 'Quota',
      modelsLabel: 'Models',
      allClaudeModels: 'All Claude models',
      unlimited: 'Unlimited',
      // Same rate limit across every tier — shown on every card
      requestLimit5h: 'Up to 300 requests every 5 hours',
      currencyNote: 'Prices shown in {currency}.',
      forfeitNotice:
        'The allowance is a single pool spent within the term. Anything left when it lapses is forfeited, not carried over or refunded — buy another pass to continue immediately.',
      plans: {
        light: {
          name: 'Day Pass-Light',
          desc: 'Light everyday use — dip a toe in.',
          features: {
            f1: '$10 allowance, billed at upstream rates',
            f2: 'Valid 24 hours from purchase',
            f3: 'Every pure-blood Claude model',
            f4: 'Buy another the moment it runs out'
          }
        },
        medium: {
          name: 'Day Pass-Medium',
          desc: 'A day of everyday use — the balanced pick.',
          features: {
            f1: '$50 allowance, billed at upstream rates',
            f2: 'Valid 24 hours from purchase',
            f3: 'Every pure-blood Claude model',
            f4: 'Buy another the moment it runs out'
          }
        },
        full: {
          name: 'Day Pass-Full',
          desc: 'Full power for heavy agent workloads.',
          features: {
            f1: '$100 allowance, billed at upstream rates',
            f2: 'Valid 24 hours from purchase',
            f3: 'Every pure-blood Claude model',
            f4: 'Buy another the moment it runs out'
          }
        }
      }
    },

    faq: {
      title: 'Frequently asked',
      subtitle: 'The questions people actually ask before signing up.',
      items: {
        pureBlood: {
          q: 'What does "pure blood Claude" actually mean?',
          a: 'Every request is served by a genuine Anthropic account. We do not route to third-party re-sellers, reverse-engineered endpoints, or other vendors\' models wearing a Claude model name. If you ask for claude-opus-4-6, an Anthropic upstream answers it.'
        },
        compatibility: {
          q: 'Will my existing code work?',
          a: 'Yes, if it speaks the Anthropic Messages API. Point your base URL at Crab2API and use your Crab2API key instead of an Anthropic key. Claude Code, the official SDKs and most desktop clients need nothing more than that.'
        },
        billing: {
          q: 'How is usage counted?',
          a: 'Per request, by input/output tokens as reported by the upstream response, with cache-read and cache-write tokens itemised separately. Every call appears in your usage records with its status, latency and cost.'
        },
        limits: {
          q: 'What happens when I hit my quota?',
          a: 'Requests return a clear quota error rather than degrading to a weaker model. You can top up or upgrade in the console, and the key resumes immediately.'
        },
        privacy: {
          q: 'Do you store my prompts?',
          a: 'Request metadata (model, tokens, latency, status) is stored for billing and troubleshooting. Prompt content logging is off by default and only applies where an operator explicitly enables auditing.'
        },
        refund: {
          q: 'Can I get a refund?',
          a: 'Unused portions of a subscription can be refunded according to the terms of service. Open a ticket from the console with your order number.'
        }
      }
    },

    cta: {
      title: 'Ready to talk to the real thing?',
      description: 'Create a key in under a minute and point your client at Crab2API.',
      primary: 'Get Started',
      secondary: 'Read the Docs'
    }
  },

  // ==================== Docs page ====================
  docsPage: {
    meta: {
      title: 'Docs — Crab2API',
      description: 'Quickstart, endpoints, client setup and FAQ for the Crab2API Claude relay.'
    },
    title: 'Documentation',
    subtitle: 'Everything you need to send your first request.',
    onThisPage: 'On this page',
    copy: 'Copy',
    copied: 'Copied',
    copyFailed: 'Copy failed',

    quickstart: {
      title: 'Quickstart',
      step1: {
        title: 'Register and subscribe',
        desc: 'Register, sign in to the console, then pick a pass (day / week / month) on the Subscription page.'
      },
      step2: {
        title: 'Get an API key',
        desc: 'Open API Keys in the console and create one against the group you subscribed to. Copy it once — the full key is only shown at creation time.'
      },
      step3: {
        title: 'Point your client at Crab2API',
        desc: 'Replace the Claude Code base URL with the Crab2API base URL and use your Crab2API key as the credential.'
      },
      step4: {
        title: 'Send a request',
        desc: 'Any upstream Messages API call works unchanged from here.'
      }
    },

    endpoints: {
      title: 'Endpoints',
      desc: 'Crab2API exposes an Anthropic-compatible surface. An OpenAI-compatible surface is available for clients that only speak that dialect.',
      baseUrl: 'Base URL',
      anthropic: 'Anthropic Messages API',
      openai: 'OpenAI-compatible Chat Completions',
      auth: 'Authentication',
      authDesc:
        'Send your key as `x-api-key` (Anthropic style) or `Authorization: Bearer <key>` (OpenAI style). Both are accepted on their respective endpoints.'
    },

    clients: {
      title: 'Client setup',
      claudeCode: {
        title: 'Claude Code',
        desc: 'Claude Code finds the relay through two environment variables: `ANTHROPIC_BASE_URL` and `ANTHROPIC_AUTH_TOKEN`. Set them, then run `claude` as usual.',
        sessionTitle: 'Session-scoped (current terminal only)',
        sessionDesc:
          'The variables live only in the terminal you typed them into and vanish when you close it. Best for a first run, or for switching relays temporarily.',
        persistTitle: 'Persistent, per user (survives new terminals)',
        persistDesc:
          'Writes to your user environment, so new terminals and reboots keep the settings.',
        noteUnix: 'On bash, use `~/.bashrc` instead of `~/.zshrc`. macOS has defaulted to zsh since Catalina.',
        noteSetx:
          '`setx` only affects windows opened afterwards — the CMD window you ran it in keeps the old values. Open a new terminal.',
        notePwsh:
          'Writes to the User scope, so no admin rights are needed. The current PowerShell window is not refreshed; open a new terminal.'
      },
      curl: {
        title: 'curl',
        desc: 'The minimal request, useful for verifying a key.'
      },
      python: {
        title: 'Python SDK',
        desc: 'The official `anthropic` package accepts a custom base URL.'
      },
      node: {
        title: 'Node SDK',
        // NOTE: no "@" in message strings — vue-i18n reads it as linked-message syntax.
        desc: 'Same idea with the official Anthropic Node SDK.'
      },
      thirdParty: {
        title: 'Desktop clients',
        desc: 'For Cherry Studio, ChatBox and similar tools, choose the Claude / Anthropic provider, then override the API host with the Crab2API base URL and paste your key.'
      }
    },

    models: {
      title: 'Models',
      desc: 'Use the model id exactly as listed. Unknown ids are rejected rather than silently remapped.',
      colId: 'Model ID',
      colName: 'Name',
      colTier: 'Tier'
    },

    errors: {
      title: 'Errors',
      desc: 'Errors follow the Anthropic error shape so existing retry logic keeps working.',
      col401: 'Invalid or missing API key.',
      col403: 'The key is valid but not permitted to use this model or group.',
      col429: 'Quota exhausted or rate limited. Check your plan in the console.',
      col5xx: 'Upstream failure. The request was not billed; retry with backoff.'
    },

    faq: {
      title: 'FAQ',
      more: 'More answers on the main page.'
    },

    help: {
      title: 'Still stuck?',
      desc: 'Open the console and use the support entry, or check your usage records for the failing request id.',
      cta: 'Open console'
    }
  }
}
