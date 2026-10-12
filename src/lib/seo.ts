import type { Metadata } from "next";
import { site } from "@/data/site";
import type { Product } from "@/data/products";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
};

export function buildMetadata({ title, description, path, type = "website", publishedTime }: PageMeta): Metadata {
  const url = `${site.url}${path}`;
  const fullTitle = path === "/" ? `${site.name} — ${site.tagline}` : `${title} — ${site.name}`;
  return {
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export function organizationJsonLd(email: string = site.email) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    description: site.description,
    logo: `${site.url}/logo.svg`,
    email,
    address: { "@type": "PostalAddress", addressCountry: "IN" },
    knowsAbout: ["Software engineering", "Custom software development", "Education technology", "Product engineering"],
  };
}

/** SoftwareApplication schema for a live product page. */
export function productJsonLd(p: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: p.name,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    url: `${site.url}/products/${p.slug}`,
    description: p.seo.description,
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };
}

export function articleJsonLd(a: { title: string; dek: string; date: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.dek,
    datePublished: a.date,
    url: `${site.url}${a.path}`,
    author: { "@type": "Organization", name: site.name },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
  };
}
