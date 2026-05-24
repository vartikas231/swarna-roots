"use client";

import { AddToCartButton } from "@/app/components/add-to-cart-button";
import { getProductImages, type HerbProduct } from "@/app/data/herbs";
import { formatPrice } from "@/app/lib/format";
import type { CSSProperties } from "react";
import Link from "next/link";

interface ProductCardProps {
  product: HerbProduct;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const primaryImage = getProductImages(product)[0];

  return (
    <article
      className="product-card reveal-stagger"
      style={{ "--i": index } as CSSProperties}
    >
      <Link
        href={`/shop/${product.slug}`}
        className={`product-thumb ${product.toneClass} ${primaryImage ? "product-thumb--photo" : ""}`}
      >
        {primaryImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={primaryImage}
              alt={product.name}
              className="product-thumb-image"
              loading="lazy"
              decoding="async"
            />
            <span className="product-thumb-overlay" aria-hidden="true" />
          </>
        ) : null}
        <div className="product-thumb-copy">
          <span className="product-category">{product.category}</span>
          <strong>{product.name}</strong>
          <small>{product.botanicalName}</small>
        </div>
      </Link>

      <div className="product-body">
        <p className="product-description">{product.shortDescription}</p>

        <div className="price-line">
          <div className="price-main">
            <strong>{formatPrice(product.price)}</strong>
            {product.compareAtPrice ? (
              <span className="compare-price">{formatPrice(product.compareAtPrice)}</span>
            ) : null}
          </div>
          <span className="unit-pill">{product.unitLabel}</span>
        </div>

        <div className="product-actions">
          <Link href={`/shop/${product.slug}`} className="btn btn-outline btn-sm">
            View
          </Link>
          <AddToCartButton
            productId={product.id}
            label="Add"
            className="product-qty-control"
            compact
            disabled={product.stock <= 0}
            maxQuantity={product.stock}
          />
        </div>
      </div>
    </article>
  );
}
