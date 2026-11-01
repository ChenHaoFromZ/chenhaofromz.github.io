/** 站点身份。改动这里同时影响导航、页脚、meta 与 hreflang。 */
export const SITE = {
  title: "Hao's Blog",
  subtitle: "Share useful insights.",
  author: "H.C.",
  description: "Share useful insights.",
  url: "https://chenhaofromz.github.io",
  /** 评论服务（Vercel + 自定义域名，避开 *.vercel.app 的 DNS 污染） */
  walineServerUrl: "https://waline.howardchenblog.de5.net",
} as const;

export const DEFAULT_LOCALE = "zh-CN";
export const LOCALES = ["zh-CN", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABEL: Record<string, string> = {
  "zh-CN": "中文",
  en: "EN",
};

/** 导航。path 不带语言前缀，渲染时按当前语言补齐。 */
export const NAV = [
  { label: "文章 / Posts", path: "/" },
  { label: "归档 / Archive", path: "/archives/" },
  { label: "关于 / About", path: "/about/" },
  { label: "项目 / Projects", path: "/projects/" },
];
