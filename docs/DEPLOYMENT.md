# 部署与运维手册

生产架构（2026-10 起）：**Cloudflare Worker `minecraft-circle-gen`**（vinext 构建）通过 Workers Route `minecraftcirclegen.com/*` 服务全部流量；旧的 Vercel 链路保留但已不在请求路径上（回滚用）。

## 日常部署

```sh
# 需要 Node 22+（vinext 依赖 node:fs/promises 的 glob；本机用 nvm 的 v22.2.0）
npm run build        # Next 构建（本地验证用）
npm test             # 296 项测试
npm run build:sites  # Cloudflare 构建，输出到 dist/
npx -y wrangler@4.153.0 deploy   # 从根 wrangler.jsonc 部署（含路由）
```

wrangler 使用本机已登录的 OAuth（leeswal123@gmail.com）。`wrangler.jsonc` 里的 `routes` 把 `minecraftcirclegen.com/*` 绑到本 Worker。

**回滚到 Vercel 链路**：删除 zone 上的 Route（Cloudflare 控制台 → 该域名 → Workers Routes），流量立即回到原 Vercel 源站（该链路未删除、停留在 2026-10-04 版本）。

## 已知坑

- **vinext 需要 Node 22**：Node 20 会报 `glob is not exported from node:fs/promises`。
- **wrangler 4.92 本地 dev 起不来**：自带 workerd 只支持兼容日期到 2026-05-22，而配置是更新的日期（生产真实运行时无此限制）；本地验证用 `npx -y wrangler@4.153.0 dev`。
- **vinext 生成的 dist/server/wrangler.json 带 `legacy_env`**：新 wrangler 会拒绝；用根 `wrangler.jsonc` 部署即可。
- **ImageResponse（next/og）在 Worker 上返回 0 字节**：OG 分享卡因此采用本地预渲染静态 PNG（`public/og/`，元数据直接引用）。重新生成：临时恢复 `opengraph-image.tsx` 路由 → `next start` → curl 各路由存入 `public/og/` → 删除路由再部署；或照 `scripts/export-circle-chart-assets.mjs` 的思路扩展。
- **边缘缓存**：zone 开了 HTML 缓存，部署后个别 URL 可能短暂返回旧内容（cache-control max-age=0 + must-revalidate，通常几分钟内自愈）。

## 收录通道

- **Google**：GSC 手动「请求编入索引」（需登录，无API凭据）；sitemap.xml 已含全部 47 URL。
- **Bing/Yandex/Seznam**：IndexNow 密钥 `public/240b0fae26447435125308bcb0ac2e83.txt`，提交端点 `https://api.indexnow.org/indexnow`（POST JSON：host/key/keyLocation/urlList），发新页面后顺手提交。
- **LLM 爬虫**：`public/llms.txt` 与 sitemap 同步维护，新页面须补录。

## 环境变量

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`（G-开头）：构建期内联，本地放 `.env`；缺失时 GA 不加载（Clarity/AdSense 是硬编码的，不受影响）。原值在旧 Vercel 项目的环境变量里。

## 待办（等用户输入）

1. GSC 对 9 个新 URL「请求编入索引」+ 重提交 sitemap.xml（清单见 docs/outreach-kit.md 顶部）
2. 提供 GA 测量 ID → 写入 `.env` → 重新部署
3. 提供游戏内实拍截图 → 嵌入对应文章
