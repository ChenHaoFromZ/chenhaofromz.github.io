import { getCollection, type CollectionEntry } from "astro:content";
import { DEFAULT_LOCALE } from "../consts";

export type Post = CollectionEntry<"blog">;

const pad = (n: number) => String(n).padStart(2, "0");

/** URL 末段：优先 front matter 的 slug，否则用文件名 */
export const slugOf = (post: Post) => post.data.slug ?? post.id;

/**
 * Hexo 兼容的路径：/<lang>/<yyyy>/<mm>/<dd>/<slug>/
 * 迁移后旧外链（如 /2026/07/30/7-29/）保持不变。
 */
export const urlOf = (post: Post) => {
  const d = post.data.date;
  const prefix = post.data.lang === DEFAULT_LOCALE ? "" : `/${post.data.lang}`;
  return `${prefix}/${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${slugOf(post)}/`;
};

/** 全部已发布文章，按日期倒序；草稿字段为 true 的不进生产构建 */
export const published = async () =>
  (
    await getCollection("blog", ({ data }) => {
      // 草稿只在开发时可见
      return import.meta.env.DEV || !data.draft;
    })
  ).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

export const byLang = async (lang: string) =>
  (await published()).filter((post) => post.data.lang === lang);

/** 同一篇文章的其他语言版本（靠 translationKey 配对） */
export const translationsOf = (post: Post, all: Post[]) =>
  post.data.translationKey
    ? all.filter(
        (p) =>
          p.data.translationKey === post.data.translationKey &&
          p.data.lang !== post.data.lang,
      )
    : [];

/** 供 <Base> 用的 hreflang 列表 */
export const alternatesOf = (post: Post, all: Post[]) => [
  { lang: post.data.lang, url: urlOf(post) },
  ...translationsOf(post, all).map((p) => ({ lang: p.data.lang, url: urlOf(p) })),
];

export const formatDate = (d: Date, lang: string) =>
  d.toLocaleDateString(lang === "en" ? "en-GB" : "zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
