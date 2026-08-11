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

## 2026-08-10 — 第二阶段:品牌残留清理

### 现象

首次部署后,落地页 Header 和 Hero 仍显示 **Sub2API**。

### 根因

**不是前端漏改**。Header/Hero 显示的是后端 `site_name` 设置项,它作为一行数据存在 settings 表里,值是上游种下的 `Sub2API`。**数据库里的值优先级高于前端任何默认值**,所以我写的 `BRAND_NAME` 兜底永远轮不到。

### 修复

1. **新增 `normalizeSiteName()`**(`frontend/src/config/brand.ts`)
   把继承自上游的站点名(`sub2api` / `sub2api-bmai` / `sub2api-frontend`,大小写不敏感)视为「从未自定义」,回落到 `Crab2API`。运营方真正自定义的名字原样透传。
   在 `stores/app.ts` 的 `applySettings()` 里统一归一化 —— 同时改写 `siteName` 和 `cachedPublicSettings.site_name`,因为有些组件读前者、有些直接读后者。另外 5 个绕过 store 直接调 `getPublicSettings()` 的页面(PlazaNavBar / LegalDocumentView / EmailVerifyView / RegisterView / KeysView)也逐个接上。
   → **无需手动改数据库,重新构建即生效。**

2. **后端 `"Sub2API"` 显示默认值全部改为 `"Crab2API"`**(11 个文件)
   覆盖:settings 默认种子、公开设置回落、邮件模板站点名、余额通知、内容审核通知、TOTP issuer、WebAuthn RP display name。
   - TOTP issuer:只影响**新绑定**的二次验证在验证器 App 里显示的标签;已绑定用户的密钥不变,验证照常通过。
   - WebAuthn:只改 display name,**RP ID(域名)未动**,已注册的 Passkey 不受影响。
   - 相关 Go 测试用的都是显式 fixture,不断言默认值,无需改动。

### 同批清理的前端残留

| 项 | 处理 |
|----|------|
| `SUB2API_API_KEY` 环境变量名(密钥使用引导的复制片段) | → `CRAB2API_API_KEY`(含 en/zh 文案与测试) |
| 控制台用户菜单里的 GitHub 链接(指向 Wei-Shaw/sub2api) | 移除 |
| KeyUsage 页脚 GitHub 链接 | 移除 |
| `ProxyAdBanner` 组件(指向 `sub2api.io/proxyip` 的第三方代理广告) | **整个组件删除**,3 处引用一并移除 |
| 导出文件名 `sub2api-account-*.json` / `sub2api-proxy-*.json` | → `crab2api-*` |
| 备份桶命名示例 `sub2api-backups` | → `crab2api-backups` |
| 批量图片任务名 / 客户端请求 ID 前缀 `sub2api-ui-` | → `crab2api-ui-`(后端无对应匹配,安全) |
| 安装向导数据库名占位符 + 默认值 | → `crab2api`,同步改 `deploy/.env.example` 的 `POSTGRES_USER` / `POSTGRES_DB` |
| `package.json` 包名 | → `crab2api-frontend` |
| onboarding.css / SettingsView / opsFormatters 里的注释 | 改写 |
| 「上游指向另一个 sub2api 兼容实例」文案 | → 「另一个同类网关实例」 |

新增 `frontend/src/config/__tests__/brand.spec.ts` 锁住 `normalizeSiteName` 的行为。

### 仍然保留 `sub2api` 的地方(全部有理由)

**协议 / 存储 / 后端契约**(改了直接坏功能,清单见第一阶段第 7 节):
合规承诺短语、`sub2api-admin` WS 子协议、`sub2api-data`/`sub2api-bundle`、`sub2api.key_billing`、各 localStorage / IndexedDB 键。

**指向上游的真实外部资源**(是可用的服务和文档,不是品牌残留):

| 位置 | 内容 |
|------|------|
| `VersionBadge.vue` | `Wei-Shaw/sub2api` + `weishaw/sub2api` —— 在线更新检查就是从这个仓库/镜像拉版本信息,改了更新功能就废了 |
| `AdminComplianceDialog.vue` | 合规文档 URL 兜底 |
| `SettingsView.vue` | 支付配置文档 URL |
| `TLSFingerprintProfilesModal.vue` | `tls.sub2api.org` 指纹采集工具 |

**代码注释**:若干说明「上游是 sub2api 时如何应答」的注释,不渲染到界面。

> ⚠️ **数据库名变更提醒**:`deploy/.env.example` 的 `POSTGRES_USER` / `POSTGRES_DB` 默认值已改为 `crab2api`。**如果你的 `.env` 是在这次改动之前创建的,里面写的还是 `sub2api`,请保持不动** —— 数据已经在那个库里了。只有全新部署才用新默认值。

---

## 2026-08-10 — 第三阶段:可达性(任何状态下所有界面都能到达)

### 设计宗旨

**对用户而言,任何状态下所有该看到的界面都可达;管理端页面仍然只对管理员开放。**
以此为准绳做了一轮全量走查,修掉所有「进得去出不来」的死胡同。

### 改动

**1. 认证页增加返回主页入口**
`components/layout/AuthLayout.vue` 左上角加固定的「← 返回主页」。这个 Layout 被登录、注册、忘记密码、重置密码、邮箱验证共用,**一处改动覆盖全部认证页**。链接跟随当前语言(`/` 或 `/zh`)。
顺带把该文件里残留的青绿色网格底纹换成品牌的 `.bg-grid`。

**2. 控制台加站点导航条**
`components/layout/AppHeader.vue` 中部加了与公开站点同款的分段控件:**主页 | 控制台 | 文档**。之前登录后控制台是「单向门」,没有任何回到落地页或文档的出口。
`md` 以下隐藏,小屏改由 `AppSidebar.vue` 底部新增的**主页 / 文档**两个入口承担(移动端抽屉与桌面折叠栏都可用)。
原来右上角那个「文档」外链(管理员配置的 `doc_url`)缩成一个图标按钮,`xl` 以上才显示 —— 内置文档已由导航条承担,避免两个「文档」并列。

**3. 落地页登录后显示头像菜单**
新增共享组件 `components/common/UserMenu.vue`:头像按钮 + 下拉(邮箱、角色、个人资料、充值/订阅、登出)。
`SiteHeader.vue` 在已登录时用它替换「登录」按钮。移动端抽屉同步补上个人资料 / 充值订阅,登出走头像菜单(头像在所有尺寸都可见)。
「充值/订阅」仅在支付功能启用时出现。
控制台自己的 Header 保留原有那个更丰富的下拉(带余额、新手引导、客服联系),不做替换,避免回归。

**4. 404 页面重做**
原来只有「Go to Dashboard」——匿名访客点了会被弹到登录页,等于没有出口;而且整页硬编码英文,还有个 `href="#"` 的死链。
现在:双语、始终提供「返回主页」、已登录才显示「进入控制台」、附「查看文档」,客服信息改为读取真实配置(没配就不显示)。

**5. 模型广场 logo 变成回主页入口**
`PlazaNavBar.vue` 的站点 logo + 名称原本不是链接,匿名访客在广场页只能去登录。现在点击回落地页。

### 走查结果

| 状态 | 页面 | 出口 |
|------|------|------|
| 匿名 | 落地页 / 文档 | 顶部导航 + 登录 ✔ |
| 匿名 | 登录 / 注册 / 忘记密码 / 重置密码 / 邮箱验证 | **← 返回主页(本次新增)** ✔ |
| 匿名 | 模型广场 | **logo → 主页(本次新增)** ✔ |
| 匿名 | 法务文档 / Key 用量查询 | logo → 主页 ✔ |
| 匿名 | 404 | **返回主页 + 文档(本次新增)** ✔ |
| 匿名 | 支付结果回跳页 | 返回充值 → 登录 → 返回主页 ✔ |
| 普通用户 | 控制台任意页 | **导航条 + 侧边栏底部(本次新增)** ✔ |
| 普通用户 | 落地页 | **头像菜单(本次新增)** + 控制台 ✔ |
| 普通用户 | 管理端页面 | 守卫重定向到 `/dashboard`,**保持不变** ✔ |
| 管理员 | 全部 | 导航条 + 头像菜单 ✔ |

**权限边界未放宽**:`requiresAdmin` 守卫、侧边栏按角色过滤、后端 admin 中间件全部原样保留。新增的导航项只有「主页 / 文档 / 控制台」,`控制台` 对管理员指向 `/dashboard/admin`、对普通用户指向 `/dashboard`,不存在越权入口。

---

## 2026-08-10 — 第四阶段:清除残留冷色调

### 现象

控制台表格的**第一列和最后一列**、以及表头,在暗色下明显偏藏蓝;系统设置页的 tab 栏也是藏蓝底。

### 根因

`tailwind.config.js` 的调色板覆盖只能作用于 **Tailwind 工具类**。而组件的 `<style>` 块里如果**硬编码颜色值**,覆盖就够不着 —— 而这些地方硬编码的恰好是 Tailwind **默认的冷灰**:

| 硬编码值 | 实际是 | 出现位置 |
|---|---|---|
| `rgb(31 41 55)` | 默认 gray-800(带蓝) | DataTable 暗色表头 / 固定列 hover |
| `rgb(17 24 39)` | 默认 gray-900(带蓝) | DataTable 暗色固定列背景 |
| `rgb(249 250 251)` | 默认 gray-50 | DataTable 亮色表头 |

DataTable 的**粘性列**(左侧首列 + 右侧操作列)必须有实体背景色才能在横向滚动时遮住下层内容,所以只能写死颜色 —— 这就是为什么每张后台表格的头尾两列看起来是蓝的。

### 修复

**引入 `--surface*` CSS 变量**(`style.css` 的 `@layer base`,亮/暗两套),把所有必须写死颜色的地方指过去,以后改表面色只有一个地方:

```
--surface / --surface-muted / --surface-sunken / --surface-raised
--surface-border / --surface-border-strong
--surface-text / --surface-text-muted
```

> 暗色用 `:root.dark` 而非 `.dark` —— `dark` 类挂在 `<html>` 上,裸 `.dark` 与 `:root` 特异性相同,会退化成依赖源码顺序。

改造范围:`DataTable.vue`(表头 + 粘性列 + hover)、`AppSidebar.vue`(分组分隔线)、`RelayPulseMatrix.vue`(监控 tooltip)、`AliyunCaptchaWidget.vue`(验证码皮肤)。

**另外回暖的部分**:

| 位置 | 原来 | 现在 |
|------|------|------|
| 系统设置 tab 栏 | slate 渐变 + `rgb(15 23 42)` 阴影 + 藏蓝暗色底 | 暖灰渐变 + 暖黑底 |
| 选中 tab 的下划线 | `linear-gradient(90deg, #14b8a6, #0ea5e9)` **旧品牌青→天蓝** | 陶土渐变 |
| 新手引导浮层 | `#1e293b` / `#334155` / `#0f172a` / `#14b8a6` | 对应暖色 |
| 公告铃 / 弹窗滚动条 | `#cbd5e1 → #94a3b8` | `#d4d1c8 → #b1ada1` |
| Key 用量查询页 | 青色渐变 + slate 骨架屏 | 陶土 + 暖灰 |
| 未读公告底色 | `bg-blue-50/30` | `bg-primary-50/40` |
| `platformColors.ts` 默认强调色 | `#14b8a6`(注释写着 "primary-500 (teal)") | `#c15f3c` |

### 刻意不改的部分

**分类图表调色板**(`ModelDistributionChart` / `GroupDistributionChart` / `EndpointDistributionChart` / `DashboardView` / 监控与 Ops 趋势图)里的 `#14b8a6`、`#0ea5e9` 等:

这些是**给不同数据系列编码用的 11 色轮**,不是品牌色。把青色换成陶土会和调色板里已有的 `#f97316` 橙撞色,两条系列线将难以区分。**数据编码色 ≠ 界面配色**,保持原样是正确的。

同理保留的还有语义色:信息提示框的蓝、平台/类型徽章的蓝(平台身份色)、成功绿、警告黄、危险红。

---

## 2026-08-10 — 退出登录改为跳转主页

退出登录后原本跳 `/login`,现在跳落地页(跟随当前语言,`/` 或 `/zh`)。三处出口全部统一:

| 位置 | 说明 |
|------|------|
| `components/common/UserMenu.vue` | 落地页 / 公开页的头像菜单 |
| `components/layout/AppHeader.vue` | 控制台右上角用户菜单 |
| `components/admin/AdminComplianceDialog.vue` | 管理员拒绝合规承诺时的强制登出(保持硬跳转以清空内存态) |

**Backend 模式是例外**:该模式下公开页对未登录用户是封闭的,跳主页会被路由守卫立刻弹回 `/login`,白闪一次。所以这三处都判断 `backendModeEnabled`,该模式下直接去 `/login`。

保持跳 `/login` 不变的场景(语义不同,不是「用户主动登出」):
- 安装向导完成后 → 需要首次登录
- OAuth 回调失败页的「返回登录」按钮
- 会话过期 / 401 被动登出 → 需要重新认证并带 `redirect` 回原页面

---

## 2026-08-10 — 三档订阅(日卡/周卡/月卡)

### 定价

| 档位 | 价格 | 额度 | 有效期 | 分组 |
|------|------|------|--------|------|
| 日卡 | ¥4.99 | $5 | 24 小时 | `crab-day` |
| 周卡 | ¥19.99 | $20 | 7×24 小时 | `crab-week` |
| 月卡 | ¥59.99 | $60 | 30×24 小时 | `crab-month` |

### 关键设计:额度一律写 `monthly_limit_usd`

后端三个配额窗口的语义**不一样**(见 `subscription_service.go` 的 `renewedSubscriptionTerm` 与 `CheckAndResetWindows`):

| 窗口 | 锚点 | 周期 |
|---|---|---|
| daily | 当天 0 点(**日历日**) | 每天午夜刷新 |
| weekly | 订阅起点 | 7×24h 滚动 |
| monthly | 订阅起点 | 30×24h 滚动 |

**日卡绝不能用 `daily_limit_usd`**:晚上 20:00 下单的用户会在午夜跨过日历日边界、额度重新发放一次,24 小时内实际可用 $10 而不是 $5。

改用 `monthly_limit_usd` 后,30 天窗口对 1/7/30 天的订阅都长于订阅本身,**窗口永远不会在订阅存续期内重置** —— 等价于「一次性总额度,到期作废」,正是所需语义。这也是为什么三档统一用同一个字段。

### 代码改动

**1. 续费语义(`subscription_service.go`)**

原逻辑:订阅**未过期**时再次购买只走 `ExtendExpiry`,**只延长到期时间、不重置用量**。
后果:用户 6 小时烧完日卡的 $5 再买一张,到期时间 +24h 但用量仍是 $5 → 依然被卡住,等于白买。

改为:购买语义(`assignmentSemantics=false`,即支付履约 / 兑换码路径)**每次都开启全新周期** —— 用量清零 + 到期时间从此刻重算。管理端分配语义(`=true`)保持原有的「续期延长」行为不变。

**2. 种子迁移(`migrations/221_crab2api_subscription_tiers.sql`)**

- 建三个 `subscription` 类型分组(倍率 1.0,`supported_model_scopes` 只留 `claude`)
- 建三个套餐并挂到对应分组
- 软删除继承自上游的 `default` 标准分组

> `subscription` 类型是「必须订阅才能拿 API Key」的开关:`canUserBindGroup()` 对该类型强制校验有效订阅,而 `standard` 类型任何人都能直接绑定。删掉 `default` 就是堵死免费档。仅在该分组没有任何 API Key 绑定时才删,避免打断运行中的部署。

**3. 管理端「确认收款」(支付占位)**

新增 `POST /api/v1/admin/payment/orders/:id/mark-paid` → `AdminMarkOrderPaid`。
刻意复用 `toPaid()`,让手动结算走**完全相同**的状态机、审计日志和履约路径 —— 不存在第二条更弱的开通通道。交易号前缀 `MANUAL-`,便于在订单列表里区分。
前端在订单管理的 PENDING 行加了「确认收款」按钮(带二次确认)。

### ⚠️ 尚未完成:用户侧下单流程

`CreateOrder` 在建单后会**无条件调用 `invokeProvider()`**,没有配置支付渠道时会抛 `PAYMENT_PROVIDER_MISCONFIGURED` 并把订单置为 FAILED —— **订单根本停不到 PENDING**,所以「下单即待支付」目前跑不通。

要跑通需要新增一个 `manual`/线下支付方式:在选渠道之前短路,建单后直接返回「请联系管理员付款」而不调用 provider。这会动到支付核心(类型注册、币种校验、渠道选择、`createOrderInTx` 的 nil 处理)和购买页的支付方式列表。

**当前可用的替代路径(都是现成的一等功能,零新代码):**
1. **管理端 → 订阅管理 → 直接给用户分配订阅**
2. **兑换码**:管理端按分组+天数生成兑换码,用户在控制台兑换(走的正是本次修好的续费路径)

---

## 2026-08-10 — 落地页定价区块对齐真实套餐

落地页原本展示的是占位的「入门/专业/旗舰 ¥49/¥149/¥399」,与迁移 221 里的真实套餐不一致。已改为日卡/周卡/月卡。

**兜底数据源** `config/brand.ts` 的 `FALLBACK_PLANS` 重写为三档真实定价,并把结构从 `priceCNY + priceUSD` 改成 `priceCNY + quotaUSD` —— 这三档只以人民币计价,给英文访客换算出一个美元价会误导实际支付金额。**改价时这里和迁移 221 要同步改。**

**周期文案** `perDay: '每天'` → `per24h: '24 小时'`,`perPeriodDays: '每 {days} 天'` → `'{days} 天'`。日卡的有效期是从下单时刻起算的 24 小时,不是「每天」,原文案会让人以为是按日历日重置。

**新增 `forfeitNotice`** 显示在定价卡片下方:「额度在有效期内一次性使用,到期未用完不结转、不退款」。这条规则属于价格旁边,不该埋在 FAQ 里。

**购买入口** 卡片按钮统一指向 `/dashboard/purchase?tab=subscription`。

- 该页面(`views/user/PaymentView.vue`)**本来就存在**,挂在侧边栏「我的账户」区,已有完整的订阅 tab:套餐卡片列表、当前生效订阅、续费弹窗。无需新建。
- `?tab=subscription` 是该页面本来就认识的参数(`PaymentView.vue` 约 1142 行),因为页面默认落在「充值」tab 上。
- 原本我写的 `?plan=<id>` 是无效参数 —— 页面认的是 `?group=<id>`,而公开套餐接口刻意不返回 `group_id`(那是网关内部接线,不该暴露给匿名访客)。所以不做单套餐深链,进去后三档都在列表里。

### ⚠️ 需要在管理后台打开支付开关

`/dashboard/purchase` 的路由 meta 是 `requiresPayment: true`,侧边栏入口也挂了 `flagPayment`。**支付未启用时该页面不可达、侧边栏也不显示**,落地页点「选择套餐」会被守卫弹走。

需要:**管理端 → 系统设置 → 支付设置 → 启用支付**。
打开后落地页会自动从兜底文案切换成数据库里的真实套餐(顶部徽标从「—」变成「实时价格」)。

---

## 阶段十一：订阅展示语义修正与倍率收口

### 一、「每月」标签是错的

订阅管理表格里,日卡/周卡的用量行都显示「每月 $0.00 / $5.00」。**后端计费没问题,是标签错了。**

三档额度都写在 `monthly_limit_usd`,这是迁移 221 的刻意选择:30 天滚动窗口比任何一档的期限都长,窗口在有效期内永远不会重置,等价于「一次性总额度,到期作废」。但前端把 `monthly_limit_usd` 无条件渲染成「每月」,还按 720 小时算了个「29 天 23 小时后重置」的倒计时 —— 日卡 24 小时就作废,那个重置永远走不到。

**修法**:把判断条件从「是不是日窗口」推广成「窗口是不是长于订阅期限」。

- `utils/subscriptionQuota.ts` 新增 `QUOTA_WINDOW_MS` 与 `isOneShotQuota(sub, period)`;原来只覆盖日窗口的 `isOneTimeDailyQuota` 已无引用,删除。
- 命中一次性额度时,标签改为「本期额度 / Term allowance」,倒计时改为已有的「额度将在 X 后结束」。
- 用户端 `views/user/SubscriptionsView.vue` 与管理端 `views/admin/SubscriptionsView.vue` 三个周期块统一走 `quotaLabel()` / `formatUsageWindow()`。
- 套餐卡片没有订阅记录,改用套餐期限判断:`components/payment/validity.ts` 新增 `planTermDays()`(镜像后端 `psComputeValidityDays` 的 week×7 / month×30 换算)与 `isPlanOneShotQuota()`,命中时标签显示「总额度 / Allowance」。

真正的周期性分组(期限长于窗口,比如 90 天期限配月度配额)不受影响,仍显示「每月」和重置倒计时。

### 二、充值/订阅顺序反了

`PaymentView` 的默认 tab 从 `recharge` 改为 `subscription`,tabs 数组也把订阅排到第一位。Crab2API 卖的是套餐,而且没有订阅就拿不到可用的 API Key,充值是次要路径。

`?tab=recharge` 现在是进入充值 tab 的显式入口(余额充值被关闭时忽略该参数)。

### 三、套餐卡片竖向拉长

- 卡片根节点加 `min-h-[26rem]`,内边距 `p-4` → `p-5`。
- 特性列表由 `space-y-1` 改为 `flex-1 + justify-evenly`,卡片变高时行距跟着撑开,而不是在按钮上方留一块死白。
- 网格加 `auto-rows-fr`,保证同一行卡片等高(某档描述更长时不会参差)。

### 四、倍率对普通用户全部隐藏

倍率是运营侧的计价旋钮:管理员配置,用户只需要看到实际扣减的美元。逐处收口:

| 位置 | 处理 |
|---|---|
| `components/common/GroupBadge.vue` | 统一收口。倍率标签/专属倍率/高峰倍率一律 admin-only;订阅分组的 `alwaysShowRate` 对普通用户退回「订阅/剩余天数」而不是变成空标签 |
| `components/common/GroupOptionItem.vue` | 倍率药丸 + 高峰倍率药丸 admin-only |
| `components/payment/SubscriptionPlanCard.vue` | 移除倍率与高峰倍率两行 |
| `views/user/PaymentView.vue` | 确认面板与「当前订阅」列表的倍率字段 admin-only |
| `views/user/SubscriptionsView.vue` | 卡片头部的「倍率: ×1」admin-only |
| `views/user/UsageView.vue` | CSV 导出的 `Rate Multiplier` 列 admin-only |
| `components/admin/usage/UsageTable.vue` | 费用明细浮层的倍率行改为 `showRateMultiplier` prop(默认 true 保持管理端不变),用户端用量页传 false |

前两项在共用组件里收口,所以 API 密钥页、模型广场、渠道状态、账号分组等所有引用点一次生效。

`UsageTable` 走 prop 而不是 store,是因为它是纯展示组件、其单测不装 Pinia;`GroupOptionItem` 的单测补了 `@/stores/auth` mock。

**注意**:这是前端隐藏。后端 `/api/v1/payment/plans` 等接口仍然返回 `rate_multiplier`,打开浏览器开发者工具能看到。要做成真正不可见,需要在后端按角色裁剪响应字段 —— 尚未做。

### 五、顺带确认:购买后的期限是自动的

用户购买不需要填有效期,链路是:

1. `payment_order.go:210` 建单时把 `psComputeValidityDays(plan.ValidityDays, plan.ValidityUnit)` 写进订单的 `subscription_days`
2. 支付成功后 `payment_fulfillment.go:500` 取出该值,以 `AssignSubscriptionInput{ValidityDays: days}` 开通订阅

所以日卡固定 1 天、周卡 7 天、月卡 30 天,来自套餐配置。

管理端「分配订阅」弹窗里的「有效期(天)」输入框只对**管理员手动分配**生效,与用户购买无关。两条路径的续期语义也不同:购买是重置(用量清零 + 到期时间从此刻重算),管理员分配是叠加(未过期时延长到期时间)—— 见 `subscription_service.go:315` 的注释。

---

## 阶段十二：版本号自持、引导配色、文档补全

### 一、移除上游的在线更新面板，版本号改为自己管

侧边栏显示 `vdev` 且提示「有新版本可用 v0.1.173」,两个问题各有来源。

**`vdev`**:`deploy/docker-compose.crab2api.yml` 把 `VERSION` build arg 默认写成了 `dev`。Dockerfile 的版本优先级是 **build arg > git tag > `backend/cmd/server/VERSION`**,而 `.git` 被 `.dockerignore` 排除,所以 git tag 那一档在 Docker 构建里永远不会命中。

改成:build arg 默认留空 → 回落到 `backend/cmd/server/VERSION`,该文件即**唯一版本来源**,已从上游继承的 `0.1.173` 重置为 `0.1.0`。

发版流程:改 `backend/cmd/server/VERSION` → 重新构建。要临时覆盖就在 `.env` 里设 `CRAB2API_VERSION`。

**「有新版本可用」**:`VersionBadge.vue` 里的在线更新/回退面板解析的是 `Wei-Shaw/sub2api` 的 GitHub 发布,拿上游的发布号跟本分支比,必然一直提示有更新;更糟的是它的「立即更新」「版本回退」按钮会把**上游的构建覆盖到本部署上**。

整块删掉,徽标退化为纯版本展示。理由不只是「Web 端不需要用户点更新」——这套机制对 fork 本身就是错的。`api/admin/system.ts` 里的 `performUpdate` / `rollback` 等函数保留(后端接口仍在,其单测也仍然通过),只是前端不再有入口。

`version` i18n 命名空间随之从 38 个 key 缩到 2 个。

### 二、新手引导配色统一到 Claude 色系

两层问题:

1. **弹窗外壳**沿用 Tailwind 默认冷灰(`#e5e7eb` `#1f2937` `#9ca3af` …),与暖色品牌不搭 → 逐一替换为 `tailwind.config.js` 里的暖中性色。
2. **正文提示框**的颜色写死在 i18n 的 HTML 片段里(`background: #f0fdf4; border-left: 3px solid #10b981`,共 54 处 × 中英),既是 Tailwind 默认绿/蓝,**也没有暗色模式版本** —— 暗色弹窗上是浅底浅字,几乎读不出来。截图里那个绿框就是这个。

正文改为只写语义类名,配色收口到 `styles/onboarding.css`,并补齐暗色:

| 类名 | 用途 | 配色 |
|---|---|---|
| `.tour-note--tip` | 提示 / 示例 | 品牌陶土色 `#c15f3c` |
| `.tour-note--info` | 说明 / 参考 | 暖中性灰,弱于品牌色,不与行动指引抢注意力 |
| `.tour-note--warn` | 注意事项 | 压低饱和度的琥珀 `#c08a3e` |
| `.tour-note--danger` | 危险操作 | 保留红色 `#b4462f` —— 警告语义不该为配色让路 |
| `.tour-cta` | 「👉 点击左侧的…」 | 品牌色,是每一步真正要看的那行 |
| `.tour-muted` | 次要说明 | 暖灰 |

### 三、文档:快速开始不再说「免费档」

`docsPage.quickstart.step1` 原文是「新账号默认进入免费档」,与本站「必须订阅才能拿到可用 Key」的设计直接矛盾。改为「注册并订阅」,并在 step2 补上「分组选择你已订阅的那一档」。

### 四、文档:客户端配置补齐三个平台 × 两种作用域

原来只有一段 `export`,Windows 用户照抄会失败。现在与「使用密钥」弹窗对齐,拆成两块:

- **会话级**(仅当前终端):macOS/Linux `export`、CMD `set`(不能带引号,否则引号会进值里)、PowerShell `$env:`
- **用户级持久**:`~/.zshrc` + `source`、`setx`、`[Environment]::SetEnvironmentVariable(..., 'User')`

每条持久化命令都带一句提醒:`setx` 和 `SetEnvironmentVariable` **都不会刷新当前窗口**,必须重开终端 —— 这是最常见的「照做了但不生效」。

### 五、订阅管理用量条与标签重叠

`.usage-label` 是 `w-10`(40px),够放「每日」「每月」两个汉字;换成「本期额度」四个字就撑破了,压到进度条上。

改为 `w-20` + `whitespace-nowrap`,进度条加 `max-w-[180px]`(标签变宽本身就会挤短 `flex-1` 的条),`.reset-info` 的缩进同步跟到 `pl-[5.5rem]` 对齐新的标签列。顺带把该行残留的 `text-blue-600` 换成品牌色。

---

## 待办 / Next

- [ ] 首次完整构建验证（前端 typecheck / build / test，后端 build / test）
- [ ] 为 `GetPublicPlans` 补一个 Go 单元测试（覆盖「支付关闭返回空数组」与「字段收窄」两条）
- [ ] 购买 `crab2api.com` 并配置 DNS + TLS
- [ ] 在管理后台把站点名设为 `Crab2API`、上传 Logo、配置 `api_base_url`
- [ ] 按真实定价录入订阅套餐（录入后落地页会自动切换到实时价格）
- [ ] 品牌化登录/注册页视觉
- [ ] 补充 `docs` 页的进阶章节（流式、工具调用、提示词缓存）
- [ ] 后端按角色裁剪 `rate_multiplier` 等运营字段（目前只在前端隐藏）
- [ ] 接入真实支付渠道（优先易支付：无需企业资质、CNY 原生、支付宝+微信一次覆盖）
