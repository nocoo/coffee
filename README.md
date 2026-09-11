# coffee · 咖啡风味宇宙

一杯咖啡，无限好奇。一个从感官入门到专业练习的中英文交互空间，也是适合咖啡店大屏的慢速风味展览。

**[打开 coffee.hexly.ai](https://coffee.hexly.ai)** · [研究与版权](docs/research-sources.md) · [部署说明](docs/deployment.md)

![coffee · A little curiosity. A world of flavor.](public/og.png)

## 在这里探索什么

- **原创 3D 风味轮**：8 个家族、24 个分支、96 个描述词；真实可点选的 Three.js 放射模型、旋转、缩放、面包屑、相关风味、收藏与生活参照练习。提供可键盘操作的 SVG 轻量视图。
- **双语知识库**：23 个产国及示例产区，15 个品种／物种组、7 种处理方式、4 个烘焙类别；30 篇感官、杯测、萃取、水质与缺陷知识，2 条学习路径及 6 题校准练习。正文、资料、搜索和导出均支持中英文。
- **冲煮实验室**：V60、Chemex、AeroPress、法压、意式、摩卡壶、虹吸、冷萃、土耳其咖啡及 Kalita 平底滤杯。可调比例、按粉量或水量反算、份数缩放；意式明确显示目标出液。偏好推荐解释匹配理由，并将方案带入手记。
- **品鉴手记**：分别记录描述性强度和个人喜好；本地保存、编辑、复制、Markdown 导出与 JSON 备份。包含配方、产地、处理、烘焙度与最多 12 个风味。损坏数据不会被静默覆盖。
- **三种心情**：糖果日光、深夜浓缩、自然产区，持久化语言、主题、收藏与学习进度；支持高对比度及系统 reduced-motion。
- **店铺展示**：18 站、每 12 秒自动巡游风味／产区／方法；暂停、跳转、全屏、语言和主题切换。环境音由 Web Audio 即时合成，默认静音，必须主动开启，可调音量和关闭。

The entire experience is available in English. Change the language in the top bar,
or open [the English edition](https://coffee.hexly.ai/?lang=en).

## 本地开发

使用 Bun 1.4+ 与现代 Node.js（资源生成和 Playwright 工具使用 Node；CI 使用 Node 24）。

```sh
bun install
bun run dev
```

Vite 默认在 `http://localhost:5173` 提供开发服务。所有内容均在仓库中，运行应用不需要 API key、数据库或环境变量。

```sh
bun run lint
bun run typecheck
bun run test
bun run build
bun run deploy:check
```

`bun run validate` 连续运行 lint、严格类型检查、Vitest 与生产构建。
构建还会检查 JavaScript、Three 引擎、CSS 和字体资源预算。
Vite 的 Three 单块 500 kB 提示仍保留；引擎是按需加载的，实际 gzip 体积另有 250 KiB 硬预算。

首次运行浏览器测试：

```sh
PLAYWRIGHT_BROWSERS_PATH=.work/browsers bunx playwright install chromium
bun run build
bun run test:e2e
```

测试自动启动生产预览（4173），覆盖桌面、手机模拟视口、三套主题、真实 3D 交互、搜索、计算器、手记、学习、展示和声音授权。
浏览器报告在 `playwright-report/`，失败 trace 和截图在 `test-results/`，均不提交。
CI 会执行相同的静态检查、单元测试、构建、部署 dry-run 与浏览器测试，不自动发布生产。

验证已部署环境：

```sh
COFFEE_BASE_URL=https://coffee.hexly.ai bun run test:e2e
```

测试只在隔离浏览器本地保存手记；没有远程数据写入。

## 项目结构

```text
src/data/          双语类型、内容、关系和来源登记
src/lib/           偏好与路由、计算器、推荐、搜索、手记、合成音
src/components/    3D / SVG 风味轮、可访问的共享组件
src/pages/         风味、产区、冲煮、学堂、手记、展示
public/            原创图标、分享图、自托管字体、SEO 与安全响应头
tests/             数据、核心逻辑、存储及 Playwright 场景
scripts/           可重现的程序化图片生成、构建资源预算
docs/              架构、内容模型、资料出处和部署
```

详见 [架构](docs/architecture.md) 与 [内容模型](docs/content-model.md)。

## 部署

采用 **Cloudflare Workers Static Assets**，配置在 [wrangler.jsonc](wrangler.jsonc)，自定义域为 **coffee.hexly.ai**。
Wrangler v4 支持直接部署静态目录，无需空的 Worker 脚本或附加后端。

```sh
bunx wrangler login
bun run deploy
```

首次部署前，确认登录账户可管理配置中的 Cloudflare account 与 `hexly.ai` zone。
Wrangler 为 `custom_domain: true` 创建对应域名绑定、DNS 与证书。
完整命令、授权范围、验证与回滚步骤见 [部署说明](docs/deployment.md)。
不要将 OAuth 文件、token、`.env` 或 `.dev.vars` 提交到 Git。

## 资料与版权

内容先参考 WCR Sensory Lexicon、WCR Varieties Catalog、SCA CVA 与 102-2024、CQI、ICO、官方产区机构和咖啡科学论文，再以原创中英文文案组织。
访问日期、逐项引用范围和许可说明见 [研究记录](docs/research-sources.md)。

这里的风味描述**不是品质评分**，国家、品种或处理法也**不保证某种味道**。
配方是明示的练习起点。本站风味层级、配色、模型和厨房练习均为原创，不复制 SCA 风味轮、官方杯测表或 WCR 的受保护定义／标准参照配方。
这是独立教育产品，与相关机构没有隶属或背书关系。

原创代码、文字和程序化视觉采用 [MIT](LICENSE)；字体、地图数据及依赖的条款见 [第三方声明](THIRD_PARTY_NOTICES.md)。
可使用 `bun run assets:render` 重新生成 PNG 图标和原生 1536×1024 分享图。

## 使用边界

手记仅保存在当前浏览器设备；没有账户、云同步或 JSON 导入界面。请自行导出备份。
偏好推荐基于公开、可阅读的规则，不连接商店库存，也不预测单批咖啡的评分。
WebGL 不可用、节省流量或低性能设备可使用二维视图；手机采用较低像素比和按需渲染。
应用是客户端 SPA，提供 SEO 元数据、站点地图和无 JavaScript 简介，尚未提供所有内容的服务端预渲染或完整离线缓存。
浏览器验证使用 Chromium 桌面和手机模拟视口，以及 1920×1080 展示画面；不等同于所有实体手机、GPU 与浏览器的实验室测试。
