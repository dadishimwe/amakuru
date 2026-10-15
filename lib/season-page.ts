import type { Metadata } from "next"
import { SITE_NAME, SITE_URL } from "@/lib/site"

export function seasonMetadata(title: string, description: string, path: string, image = `${SITE_URL}/images/rwanda-racing-hero.webp`): Metadata {
  const url = `${SITE_URL}${path}`
  const isProductionDeployment = process.env.VERCEL_ENV === "production"
  return {
    title: { absolute: title },
    description,
    robots: { index: isProductionDeployment, follow: isProductionDeployment },
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      locale: "en_RW",
      title,
      description,
    images: [{ url: image, alt: "Amakuru Motorsport editorial illustration or credited motorsport photograph" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}

export function breadcrumbJsonLd(items: Array<{ name: string; path?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.path ? { item: `${SITE_URL}${item.path}` } : {}),
    })),
  }
}
