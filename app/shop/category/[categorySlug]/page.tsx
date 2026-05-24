import { CategoryProductGrid } from "@/app/components/category-product-grid";
import { siteConfig } from "@/app/config/site";
import { getProductImages } from "@/app/data/herbs";
import {
  getAllCategoryProfiles,
  getCategoryProfileBySlug,
  getProductsForCategory,
} from "@/app/lib/category-seo";
import { toAbsoluteUrl } from "@/app/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>;
}

export function generateStaticParams() {
  return getAllCategoryProfiles().map((profile) => ({
    categorySlug: profile.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const profile = getCategoryProfileBySlug(categorySlug);
  if (!profile) {
    return {
      title: "Category not found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalPath = `/shop/category/${profile.slug}`;
  const title = `${profile.name} Collection`;
  const products = getProductsForCategory(profile.slug);
  const imageUrl = products
    .map((product) => getProductImages(product)[0])
    .find(Boolean);

  return {
    title,
    description: profile.description,
    keywords: profile.keywords,
    alternates: {
      canonical: canonicalPath,
      languages: {
        "en-IN": canonicalPath,
        "en-US": canonicalPath,
        "x-default": canonicalPath,
      },
    },
    openGraph: {
      type: "website",
      url: toAbsoluteUrl(canonicalPath),
      title: `${title} | ${siteConfig.brand.name}`,
      description: profile.description,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    robots: {
      index: profile.indexable,
      follow: true,
    },
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const profile = getCategoryProfileBySlug(categorySlug);
  if (!profile) {
    notFound();
  }

  const products = getProductsForCategory(profile.slug);
  const categoryPath = `/shop/category/${profile.slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: toAbsoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: toAbsoluteUrl("/shop"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: profile.name,
        item: toAbsoluteUrl(categoryPath),
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${profile.name} | ${siteConfig.brand.name}`,
    url: toAbsoluteUrl(categoryPath),
    description: profile.description,
  };

  const itemListJsonLd = products.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${profile.name} Products`,
        itemListElement: products.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: toAbsoluteUrl(`/shop/${product.slug}`),
          name: product.name,
        })),
      }
    : null;

  return (
    <div className="page-stack">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            itemListJsonLd
              ? [breadcrumbJsonLd, collectionJsonLd, itemListJsonLd]
              : [breadcrumbJsonLd, collectionJsonLd],
          ),
        }}
      />

      <section className="section-card reveal reveal-delay-1">
        <p className="eyebrow">Category Collection</p>
        <h1 className="page-title">{profile.name}</h1>
        <p className="page-subtitle">{profile.description}</p>

        <div className="category-badges">
          <span className="tag">{profile.tagline}</span>
          {profile.marketFocus.map((item) => (
            <span key={item} className="tag">
              {item}
            </span>
          ))}
        </div>

        <p className="filter-summary">{profile.originStory}</p>
      </section>

      <section className="section-card reveal reveal-delay-2">
        <div className="section-head">
          <h2>{profile.name} products</h2>
          <Link href="/shop">Back to full shop</Link>
        </div>

        <CategoryProductGrid categoryName={profile.name} fallbackProducts={products} />
      </section>
    </div>
  );
}
