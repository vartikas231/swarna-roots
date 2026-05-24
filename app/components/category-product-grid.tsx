"use client";

import { ProductCard } from "@/app/components/product-card";
import { useStorefront } from "@/app/components/storefront-provider";
import type { HerbProduct } from "@/app/data/herbs";
import Link from "next/link";
import { useMemo } from "react";

interface CategoryProductGridProps {
  categoryName: string;
  fallbackProducts: HerbProduct[];
}

export function CategoryProductGrid({
  categoryName,
  fallbackProducts,
}: CategoryProductGridProps) {
  const { state } = useStorefront();
  const products = useMemo(() => {
    const fromStorefront = state.products.filter(
      (product) => product.category.toLowerCase() === categoryName.toLowerCase(),
    );

    return fromStorefront.length > 0 ? fromStorefront : fallbackProducts;
  }, [categoryName, fallbackProducts, state.products]);

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <h2>Coming soon</h2>
        <p>
          We are curating this collection now. Reach us on WhatsApp for early access
          recommendations.
        </p>
        <Link href="/shop" className="btn btn-primary">
          Explore current catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
