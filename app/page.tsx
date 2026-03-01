import type { Metadata } from "next";
import { HomePageClient } from "@/app/components/home-page-client";
import { siteConfig } from "@/app/config/site";
import { toAbsoluteUrl } from "@/app/lib/seo";

export const metadata: Metadata = {
  title: "Swarna Roots | Ayurvedic Herbs, Himachal Teas & Wellness Essentials",
  description: siteConfig.brand.metaDescription,
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "en-US": "/",
      "x-default": "/",
    },
  },
  keywords: [
    "Swarna Roots",
    "Ayurvedic herbs",
    "Himachal tea",
    "herbal teas India",
    "wellness oils",
    "natural spices",
    "wellness candles",
    "herbal products online",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: ["en_US"],
    url: toAbsoluteUrl("/"),
    siteName: siteConfig.brand.name,
    title: "Swarna Roots | Ayurvedic Herbs, Himachal Teas & Wellness Essentials",
    description: siteConfig.brand.metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: "Swarna Roots | Ayurvedic Herbs, Himachal Teas & Wellness Essentials",
    description: siteConfig.brand.metaDescription,
  },
};

export default function Home() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: siteConfig.brand.name,
    url: toAbsoluteUrl("/"),
    description: siteConfig.brand.metaDescription,
    sameAs: [
      siteConfig.social.instagramUrl,
      siteConfig.social.linkedinUrl,
      siteConfig.social.facebookUrl,
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: `+${siteConfig.support.whatsappNumber}`,
        email: siteConfig.support.email,
        contactType: "customer service",
      },
    ],
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brand.name,
    url: toAbsoluteUrl("/"),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationJsonLd, websiteJsonLd]),
        }}
      />
      <HomePageClient />
    </>
  );
}
