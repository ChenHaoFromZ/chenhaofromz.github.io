import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * 已发布文章。date 设为必填是刻意的：
 * Hexo 时代 hello-world.md 缺 date 会退回文件系统时间，导致从仓库构建时
 * URL 与日期随检出时刻漂移；Zod schema 让这类问题在构建期直接失败。
 */
const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.md" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    // Hexo 时代的 `tags:`（留空）会解析成 null，这里统一归一化为数组
    tags: z.array(z.string()).nullish().transform((v) => v ?? []),
    categories: z.array(z.string()).nullish().transform((v) => v ?? []),
    /** 语言；默认语言不带 URL 前缀 */
    lang: z.enum(["zh-CN", "en"]).default("zh-CN"),
    /** 同一篇文章的不同语言版本用同一个值配对 */
    translationKey: z.string().optional(),
    /** 覆盖 URL 中的末段（缺省用文件名），用于保持旧链接 */
    slug: z.string().optional(),
    summary: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
