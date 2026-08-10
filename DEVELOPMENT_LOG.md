# Crab2API 开发日志 / Development Log

> 本文件独立记录 Crab2API（螃蟹中转站）在 Sub2API 基础上的品牌化与前端改造过程。
> 每次改动都应在此追加条目，说明**做了什么**、**为什么**、以及**哪些地方被刻意保留不动**。

---

## 项目定位

| 项 | 值 |
|----|----|
| 产品名 | **Crab2API**（全部引用统一使用此拼写） |
| 中文俗称 | 螃蟹中转站 |
| 域名 | `crab2api.com`（站点入口） |
| Slogan | `Only pure blood Claude models!` / `只中转纯血 Claude 模型！` |
| 定位 | 只中转纯血 Claude 模型的 API 中转服务 |
| 上游项目 | Sub2API（Wei-Shaw/sub2api），后端基本保持不变 |
| 分支策略 | 直接在 `main` 上开发（本仓库已是 fork 并更名为 Crab2API） |

---

## 2026-08-10 — 第一阶段：品牌化 + 落地页 + 路由重构

### 决策记录（开工前确认）

| 议题 | 结论 |
|------|------|
| 落地页套餐价格来源 | **新增后端公开接口** `GET /api/v1/payment/public/plans` |
| 控制台路由 | **完整迁移到 `/dashboard/**`** + 全量旧路径永久重定向 |
| 文档页 | **站内双语文档页**（`/docs`、`/zh/docs`） |
| 分支 | 不新建分支，全部在 `main` 上进行 |

---

### 1. 品牌基础（配色 / Logo / 全局样式）

**改动**

- `frontend/tailwind.config.js` — 全量重写调色板，改用 Claude 官方色系：
  - `primary` 陶土色阶，品牌主色 `#c15f3c`（`primary-500`）
  - `gray` / `accent` / `dark` 三套中性色**全部覆盖为暖灰**（`#f4f3ee` 米白、`#b1ada1` 暖灰、`#171614` 暖黑）
  - 阴影 / 渐变 / glow 全部改为陶土色调
- `frontend/public/logo.svg` — 新建螃蟹 Logo（米白圆角底 + 陶土蟹身，线条化钳与腿）
- `frontend/src/components/brand/BrandLogo.vue` — 同一图形的内联组件版，使用 `currentColor`，可随父级文字色变化
- `frontend/index.html` — 标题、描述、`theme-color` 全部改为 Crab2API
- `frontend/src/style.css`
  - **滚动条彻底隐藏但保留滚动能力**（`scrollbar-width: none` + `::-webkit-scrollbar { width: 0 }`）
  - 新增落地页工具类：`.bg-grid`（极客风网格底纹，明暗自适应）、`.hairline`、`.mono-label`
- `frontend/src/config/brand.ts` — **新建**，品牌单一事实来源：产品名、域名、默认 API Base URL、对外展示的 Claude 模型清单、兜底套餐配置

**为什么这样做**：控制台有上百个页面，直接覆盖 Tailwind 的 `gray`/`dark`/`primary` 三套色阶，可以让继承自 Sub2API 的所有界面**一次性换肤**，无需逐个改 class。

---

### 2. 站点通用框架（吸顶 Header）

**新增文件**

| 文件 | 作用 |
|------|------|
| `components/public/PublicLayout.vue` | 公开页外壳（Header + 内容 + Footer），含键盘可达的 skip-link |
| `components/public/SiteHeader.vue` | **吸顶** Header |
| `components/public/SiteFooter.vue` | 页脚 |
| `composables/useTheme.ts` | 全局共享的日/夜模式状态（模块级单例） |
| `composables/usePublicLocale.ts` | 公开页语言 ↔ URL 的双向映射 |

**Header 布局**（按需求）：

```
[Logo + Crab2API]        [主页 | 控制台 | 文档]        [语言 ▾] [☀/☾] [登录]
   左对齐                      居中分段控件                    右对齐
```

- `sticky top-0 z-50` + 毛玻璃背景，滚动时始终吸顶
- 移动端：中间导航收进抽屉菜单
- 语言下拉只有 **简体中文 / English** 两项，**默认中文**
- 主题默认 **日间模式**（`main.ts` 里刻意忽略 `prefers-color-scheme`，只认用户显式选择）
- 「登录」按钮：未登录跳 `/login`（复用已有的登录页，比占位页更实用）；已登录时变成「控制台」

---

### 3. 落地页（主页）

`views/public/LandingView.vue` + `components/public/landing/` 下 6 个分区组件：

| 组件 | 内容 |
|------|------|
| `LandingHero.vue` | Logo、品牌名、Slogan、说明、双 CTA、右侧「网关链路」演示面板（客户端 → 网关 → 上游 + 状态/延迟/Token/模型指标） |
| `LandingFeatures.vue` | 6 项品牌卖点：纯血 Claude、绝不偷换模型、零改造接入、账目透明、会话保持、池化容灾 |
| `LandingModels.vue` | 可用 Claude 模型清单（旗舰/均衡/轻快三档） |
| `LandingPricing.vue` | 订阅套餐卡片（价格、周期、功能点、CTA） |
| `LandingFaq.vue` | 6 条常见问题手风琴 |
| `LandingCta.vue` | 收尾行动号召 |

**套餐数据流**：优先请求 `GET /api/v1/payment/public/plans`；若支付未启用、无在售套餐或接口不可用，则回退到 `config/brand.ts` 里的三档参考套餐（文案走 i18n，中英各一套），并显示「参考价格」提示。**定价区块永远不会塌成空白。**

**保留的既有能力**：管理员在系统设置里配置的 `home_content`（自定义首页 HTML / iframe）依然生效，会整页覆盖落地页。

---

### 4. 文档页

`views/public/DocsView.vue` + `components/public/CodeBlock.vue`（带复制按钮的代码块）。

分区：快速开始（4 步）、接口地址、客户端配置（Claude Code / curl / Python SDK / Node SDK / 桌面客户端）、模型表、错误码、求助入口。左侧有吸顶目录。

**代码示例里的 Base URL 取自 `api_base_url` 公开配置**，运营方配置后，访客复制到的示例就是当前部署的真实地址。

---

### 5. 路由重构

新的 URL 契约集中定义在 `frontend/src/router/paths.ts`。

**公开站点（带语言前缀）**

| 语言 | 主页 | 文档 |
|------|------|------|
| English | `/` | `/docs` |
| 中文 | `/zh` | `/zh/docs` |

- 首次访问且从未选择过语言时，`/` 与 `/docs` 会重定向到 `/zh` 与 `/zh/docs`（满足「默认中文」）
- 一旦用户显式切换过语言，URL 即为准，不再重定向
- 语言切换器在公开页会**同时改写 URL**，地址栏与渲染语言始终一致

**控制台（不带语言前缀）**

- 用户端：`/dashboard`、`/dashboard/keys`、`/dashboard/usage`、`/dashboard/profile` …
- 管理端：`/dashboard/admin/dashboard`、`/dashboard/admin/users` …
- 全部旧扁平路径（`/keys`、`/usage`、`/admin/**` …）注册为**永久重定向**，书签与遗留链接不会断

**刻意保留在站点根目录的路径（重要）**

| 路径 | 原因 |
|------|------|
| `/payment/**` | ⚠️ 后端 `internal/service/payment_resume_service.go` 里 `paymentResultReturnPath = "/payment/result"` 是**硬校验**，改动会导致下单直接报 `INVALID_RETURN_URL` |
| `/auth/**` | OAuth 回调地址已在上游服务商处注册，不能改 |
| `/login` `/register` `/setup` `/key-usage` `/legal/**` `/model-plaza` | 认证与公开工具页，后端 backend-mode 白名单按这些路径匹配 |
| `/dashboard`（用户端首页） | 后端多个 OAuth handler 的默认跳转常量就是 `/dashboard` |

`/docs/batch-image` 这个旧别名与新的公开文档页冲突，已改为重定向到 `/dashboard/batch-image`。

**同步更新**：`router/setupRedirect.ts`、`composables/useRoutePrefetch.ts`（预加载邻接表 + 管理员路由判定）、`AppSidebar.vue` 全部导航项、以及各视图里的 `router.push` / `router-link` 字面量。

---

### 6. 后端唯一改动：公开套餐接口

- `backend/internal/handler/payment_handler.go` — 新增 `GetPublicPlans`
- `backend/internal/server/routes/payment.go` — 注册 `GET /api/v1/payment/public/plans`，套用与 `/settings/public` 同款的 `panelRateLimiter.PublicIP()` 按 IP 限流

**返回体是收窄过的投影**，刻意剔除了认证接口才有的运营字段：`group_id` / `group_name` / `group_platform` / `rate_multiplier` / 峰值费率窗口 / `product_name` / `for_sale`。这些描述的是网关内部怎么接线，不该出现在营销页上。

支付系统未启用时返回**空数组而非错误**，前端据此走兜底文案，不必特判状态码。

---

### 7. 品牌文案替换（以及刻意不改的部分）

用户可见的 `Sub2API` 已全部替换为 `Crab2API`（i18n 中英文案、站点名默认值、设置页占位符、密钥使用引导里的配置示例等）。

**以下标识符刻意保留 `sub2api`，改了会直接坏功能：**

| 标识符 | 位置 | 原因 |
|--------|------|------|
| `我已阅读、理解并同意 Sub2API 部署与运营合规承诺` | `stores/adminCompliance.ts` | 后端 `AdminComplianceAckPhraseZH/EN` **逐字节比对**，前端单方面改会导致合规确认永远提交不了 |
| `sub2api-admin` | `api/admin/ops.ts` | Ops WebSocket 子协议，后端 `ops_ws_handler.go` 按此名握手 |
| `sub2api-data` / `sub2api-bundle` | 数据导入导出 | 后端 `account_data.go` 的数据格式标识 |
| `sub2api.key_billing` | `types/index.ts` | 后端响应体的类型判别字段 |
| `sub2api_locale` / `sub2api:ip-geo-cache:v1` 等 | localStorage 键 | 改名等于清空老用户的本地状态 |
| `Wei-Shaw/sub2api` / `weishaw/sub2api` | `VersionBadge.vue` | 上游仓库与镜像地址，版本更新检查依赖它 |

**已知的小遗留**：后端 `internal/web/embed_on.go` 注入的 HTML 标题格式是 `{站点名} - AI API Gateway`。运营方把站点名设为 Crab2API 后，首屏 HTML 标题会是「Crab2API - AI API Gateway」；前端挂载后会立刻改写为正确标题，仅影响爬虫看到的初始 HTML。属后端行为，本次未动。

---

### 8. 测试同步

因路由与品牌文案变更，同步更新了：

- `router/__tests__/feature-access.spec.ts`、`guards.spec.ts`、`title.spec.ts`
- `composables/__tests__/useRoutePrefetch.spec.ts`
- `i18n/__tests__/openaiFastPolicyLocales.spec.ts`、`localesNoKeyCollision.spec.ts`（新增 `crab` 模块的顶层键冲突检测）
- `components/keys/__tests__/UseKeyModal.spec.ts`

**注意**：vue-i18n 会把消息文本里的 `@` 解析成链接消息语法，因此文案中不能出现裸 `@`（原本写的 `@anthropic-ai/sdk` 已改为文字描述）。

---

### 9. 部署：从源码构建镜像

上游的 compose 文件全部拉取已发布的 `weishaw/sub2api:latest` 镜像，**那个镜像里没有 Crab2API 前端**。因此新增 `deploy/docker-compose.crab2api.yml` 覆盖层，把 `sub2api` 服务改为从本仓库 Dockerfile 构建（镜像名 `crab2api:local`，容器名 `crab2api`）。

服务键仍叫 `sub2api`，是为了让这个覆盖层能和上游任意 compose 文件干净合并。

```bash
cd deploy
cp .env.example .env                  # 至少填 POSTGRES_PASSWORD / JWT_SECRET / TOTP_ENCRYPTION_KEY
mkdir -p data postgres_data redis_data
docker compose -f docker-compose.local.yml -f docker-compose.crab2api.yml up -d --build
```

---

### 10. 本次未能在本机验证的部分 ⚠️

开发机上**没有安装 Go 与 Node/pnpm，Docker Desktop 也未启动**，因此以下命令均未实际执行：

```
cd frontend && pnpm install && pnpm typecheck && pnpm build && pnpm test:run
cd backend  && go build ./... && go test -tags=unit ./...
docker build -t crab2api:dev .
```

代码是按类型契约逐处核对后写的，但**首次构建前请务必跑一遍上述命令**，并把结果补记到本日志。

---

## 待办 / Next

- [ ] 首次完整构建验证（前端 typecheck / build / test，后端 build / test）
- [ ] 为 `GetPublicPlans` 补一个 Go 单元测试（覆盖「支付关闭返回空数组」与「字段收窄」两条）
- [ ] 购买 `crab2api.com` 并配置 DNS + TLS
- [ ] 在管理后台把站点名设为 `Crab2API`、上传 Logo、配置 `api_base_url`
- [ ] 按真实定价录入订阅套餐（录入后落地页会自动切换到实时价格）
- [ ] 品牌化登录/注册页视觉
- [ ] 补充 `docs` 页的进阶章节（流式、工具调用、提示词缓存）
