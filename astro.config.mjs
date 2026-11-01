import { defineConfig } from "astro/config";

// 站点部署在 GitHub Pages 用户站（<user>.github.io），所以不需要 base。
export default defineConfig({
  site: "https://chenhaofromz.github.io",
  // Hexo 的 URL 以 / 结尾，保持一致，已有外链不会失效
  trailingSlash: "always",
  i18n: {
    defaultLocale: "zh-CN",
    locales: ["zh-CN", "en"],
    // 默认语言不带前缀，与迁移前一致
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    shikiConfig: { themes: { light: "github-light", dark: "github-dark" } },
  },
});
