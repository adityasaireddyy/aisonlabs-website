import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { products } from "@/data/products";
import { listArticles, listJobs, listPosts } from "@/lib/db/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/research`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.url}/careers`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${site.url}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];
  for (const sv of services) routes.push({ url: `${site.url}/work/${sv.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.7 });
  for (const p of products) {
    routes.push({ url: `${site.url}/products/${p.slug}`, lastModified: now, changeFrequency: "monthly", priority: 0.9 });
  }
  const [articles, posts, jobs] = await Promise.all([listArticles({ status: "published" }), listPosts({ status: "published" }), listJobs({ status: "open" })]);
  for (const a of articles) routes.push({ url: `${site.url}/research/${a.slug}`, lastModified: new Date(a.updatedAt), changeFrequency: "yearly", priority: 0.5 });
  for (const p of posts) routes.push({ url: `${site.url}/blog/${p.slug}`, lastModified: new Date(p.updatedAt), changeFrequency: "monthly", priority: 0.5 });
  for (const j of jobs) routes.push({ url: `${site.url}/careers/${j.slug}`, lastModified: new Date(j.updatedAt), changeFrequency: "weekly", priority: 0.5 });
  return routes;
}
