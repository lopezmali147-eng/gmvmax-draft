# GMV Max 演示站 — 部署指南（Cloudflare Pages）

本文件记录从源码到公网 HTTPS 上线的完整流程。适用于首次部署以及后续改代码重新部署。

## 当前线上状态（截至部署日）

| 项 | 值 |
|----|----|
| 源码仓库 | `https://github.com/lopezmali147-eng/gmvmax-draft`（`main` 分支） |
| 托管平台 | Cloudflare Pages（连 Git 自动部署） |
| 预览地址 | `https://gmvmax-draft.pages.dev` |
| 自定义域名 | `https://gmvmax.tkbigboom.top`（已绑、SSL 已启用、DNS 在 Cloudflare） |
| 构建命令 | `npm run build` |
| 构建产物目录 | `dist` |
| Node 版本 | `22`（CF 环境变量 `NODE_VERSION=22`） |

> 用途：作为 TikTok 开发者申请的「产品演示 / 落地页」材料（Landing + Privacy + Terms + Demo + 完整 `/dashboard` 看板，全 HTTPS）。

---

## 一、本地构建（改代码后必做）

```bash
cd gmvmax-draft
npm install        # 仅首次或依赖变更时需要
npm run build      # 执行 tsc 类型检查 + vite build，产物输出到 dist/
```

构建成功后确认：
- `dist/index.html` 存在
- `dist/_redirects` 存在（内容 `/*    /index.html   200`，解决 SPA 深链 404）
- `dist/.htaccess` 存在（仅当改用 Apache 主机时才有用，CF 不读它，无害）

> 注意：`public/` 下的 `_redirects` 和 `.htaccess` 会在 `npm run build` 时自动拷贝进 `dist/`，无需手动复制。

---

## 二、推送到 GitHub（触发自动部署）

```bash
git add .
git commit -m "描述你的改动"
git push -u origin main
```

推送后 Cloudflare Pages 会**自动重新构建并部署**，域名（`gmvmax.tkbigboom.top`）和预览地址都不变。

> 首次推送需 GitHub 命令行凭证（Personal Access Token 或 SSH key）。网页登录态 ≠ Git 凭证。

---

## 三、Cloudflare Pages 初次部署（仅需一次）

1. 登录 `dash.cloudflare.com` → **Workers & Pages** → **创建** → 选 **Pages** tab
2. 点 **连接到 Git** → 授权 GitHub → 选仓库 `gmvmax-draft`
3. 配置：
   - Project name：`gmvmax-draft`
   - Production branch：`main`
   - Framework preset：**无**（手动填命令更稳，避免误选 VitePress）
   - Build command：`npm run build`
   - Build output directory：`dist`
4. 展开 **环境变量（高级）** 加一条：`NODE_VERSION = 22`
5. 点 **保存并部署**
6. 完成后得到 `https://gmvmax-draft.pages.dev`

> ⚠️ 常见坑：框架预设不要选错成 **VitePress**（会改成 `npx vitepress build` 导致失败）。选「无」手动填最稳妥。

---

## 四、绑定自定义域名（仅需一次）

前提：域名 NS 已迁到 Cloudflare（本域名 `tkbigboom.top` 已是）。

1. Cloudflare → 你的域名 → **DNS** → **添加记录**：
   - 类型：`CNAME`
   - 名称：`gmvmax`
   - 目标：`gmvmax-draft.pages.dev`
   - 代理状态：开启（橙色云 ☁️）
2. Cloudflare → **Workers & Pages** → `gmvmax-draft` → **自定义域** → 添加 `gmvmax.tkbigboom.top`
3. CF 检测到 DNS 后自动签发 **Universal SSL**（免费，几分钟）
4. 状态变 **Active** 后即可访问 `https://gmvmax.tkbigboom.top`

> 若域名原本挂着企业邮箱，NS 迁到 CF 后需在 CF DNS 里**补回 MX 记录**，否则邮件中断。本域名纯做演示可忽略。

---

## 五、验证上线

部署/绑定后，确认以下地址均返回 200：

```bash
curl -s -o /dev/null -w "%{http_code}\n" "https://gmvmax.tkbigboom.top/"
curl -s -o /dev/null -w "%{http_code}\n" "https://gmvmax.tkbigboom.top/dashboard/overview"
```

深链 `/dashboard/overview` 能直接打开 / 刷新 / 分享而不 404，说明 `_redirects` 生效。

---

## 六、故障排查

| 现象 | 原因 / 处理 |
|------|------------|
| 深链 404 | `dist/_redirects` 缺失或未被部署 → 重新 `npm run build` 并确认文件在 `dist/` |
| 访问自定义域 522 | 自定义域只在 DNS 建了 CNAME，但没在 CF Pages「自定义域」里登记 → 去 Pages 项目补登 |
| 访问自定义域 526 | SSL 证书签发中 → 等 5~15 分钟 |
| `dash.cloudflare.com` 打不开 / 429 | 本机 IP / 浏览器被 Cloudflare 风控（JS 挑战）→ 换浏览器或换网络；不影响已上线站点 |
| 构建失败（vitepress） | 框架预设误选 VitePress → 改回「无」并手动填 `npm run build` + `dist` |

---

## 七、清理提示

- 已淘汰的 `gmvmax.ai5678.top` 的 CNAME 记录若仍留在 CF DNS 中且未在 Pages 注册，访问会 522，可删除以免混淆。
