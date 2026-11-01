# Hao's Blog（Astro 版）

从 Hexo + redefine 主题迁移而来。**只保留内容，其余全部重写。**

## 为什么迁

Hexo 的首页天生是「按日期倒序的文章流」，要变成「个人主页 + 非时间序栏目（about / projects / CV）」
必须跟框架对抗。Astro 用内容集合 + 显式路由，栏目结构由你决定，i18n 也是原生支持。

## 本地开发

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # 产物在 dist/
npm run preview
```

> 沙箱/受限环境下 Astro 的遥测会尝试写 `~/.config/astro` 而失败，加 `ASTRO_TELEMETRY_DISABLED=1` 即可。正常机器不需要。

## 内容放在哪

| 路径 | 说明 |
|---|---|
| `src/content/blog/*.md` | 已发布文章。**`date` 必填**（见下） |
| `drafts/*.md` | 私有草稿，`drafts/` 已 gitignore —— 对应 Hexo 时代的 `source/_drafts/`，**绝不进公开仓库** |
| `public/images/` | 图片，正文里用 `/images/xxx.png` 引用 |
| `src/consts.ts` | 站点标题、作者、导航、Waline 地址 |
| `src/pages/about.astro`、`projects.astro` | 个人信息页，现在是骨架，需你填写 |

### front matter

```yaml
---
title: 标题
date: 2026-07-30 01:42:03   # 必填；Zod 会拒绝缺失
lang: zh-CN                 # 默认 zh-CN
translationKey: some-key    # 同一篇文章的各语言版本用同一个值配对
slug: custom-name           # 可选，覆盖 URL 末段
tags: [Hexo]
draft: false                # 仅 DEV 可见
---
```

`date` 之所以强制必填：Hexo 时代 `hello-world.md` 缺 `date` 会退回文件系统时间，
导致从仓库构建时 URL 与日期随检出时刻漂移。schema 让这类问题在构建期直接失败。

### URL 规则（与迁移前完全一致）

```
/<lang>/<yyyy>/<mm>/<dd>/<slug>/
```

默认语言不带前缀。旧外链（`/2026/07/30/7-29/`）**保持不变**；`slug` 缺省取文件名。
新增译文时把 `lang: en` + 相同的 `translationKey` 写上即可，`/en/...` 路由与语言切换器会自动生效。

## 换掉 github.io 上现有的内容

现有 `ChenHaoFromZ/chenhaofromz.github.io` 仓库里是 Hexo 的**构建产物**，要被替换成这份 Astro 源码。
顺序很重要：

1. **先保住草稿**：`drafts/` 是 gitignore 的，推送到 GitHub 后不会上传 —— 这正是要的。但确认本地有副本。
2. 把这个目录移出 MyBlog（例如 `~/repositories/hao-blog`），它才是新的项目根。
3. GitHub 仓库 **Settings → Pages → Source 选 “GitHub Actions”**（不要再用 “Deploy from a branch”）。
4. 把 Astro 源码推到该仓库的 `main`。旧产物要清掉，所以：
   ```bash
   git init && git add -A && git commit -m "feat: migrate blog to Astro"
   git branch -M main
   git remote add origin git@github.com:ChenHaoFromZ/chenhaofromz.github.io.git
   git push -f origin main     # -f：用新历史覆盖 Hexo 产物
   ```
5. Actions 会自动跑 `.github/workflows/deploy.yml`（`withastro/action@v6` + `actions/deploy-pages@v5`）并发布。
6. 验证 `https://chenhaofromz.github.io/` 与旧文章链接。
7. **确认无误后**再归档/删除 `MyBlog`。它现在是草稿的唯一备份。

## 相对 Hexo 版还缺什么

- **标签页 / 分类页**：没重建（当前 0 个 tag/category，建了也是空页）。需要时加 `src/pages/tags/[tag].astro`。
- **归档分页**：现在是单页列出全部。文章多了再加分页。
- **RSS / sitemap / 站内搜索 / TOC / 文章加密**：都还没做，`@astrojs/sitemap`、`@astrojs/rss` 各一行集成即可。
- **评论域名限制**：`SECURE_DOMAINS` 是 Vercel 环境变量，与本次迁移无关，保持
  `chenhaofromz.github.io,waline.howardchenblog.de5.net` 不变。评论按 `path` 归属，历史评论不受影响。
