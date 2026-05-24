"use client";

import { getProductImages, type HerbProduct } from "@/app/data/herbs";
import { useMemo, useState, type CSSProperties } from "react";

interface ProductGalleryProps {
  product: HerbProduct;
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const images = useMemo(() => getProductImages(product), [product]);
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className={`detail-visual ${product.toneClass}`}>
        <span className="tag">{product.category}</span>
        <h1>{product.name}</h1>
        <p>{product.botanicalName}</p>
      </div>
    );
  }

  const visibleIndex = activeIndex % images.length;
  const currentImage = images[visibleIndex];
  const showControls = images.length > 1;

  return (
    <div className="product-gallery">
      <div className="product-gallery-main">
        <div className={`product-gallery-frame ${product.toneClass}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt={`${product.name} image ${visibleIndex + 1}`}
            className="product-gallery-image"
            decoding="async"
          />
          <div className="product-gallery-overlay">
            <div className="product-gallery-top">
              <span className="tag">{product.category}</span>
              {showControls ? (
                <span className="product-gallery-counter">
                  {visibleIndex + 1} / {images.length}
                </span>
              ) : null}
            </div>
            <h1>{product.name}</h1>
            <p>{product.botanicalName}</p>

            {showControls ? (
              <div className="product-gallery-nav">
                <button
                  type="button"
                  className="product-gallery-nav-btn"
                  onClick={() =>
                    setActiveIndex((prev) => (prev - 1 + images.length) % images.length)
                  }
                  aria-label={`Show previous image of ${product.name}`}
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="product-gallery-nav-btn"
                  onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
                  aria-label={`Show next image of ${product.name}`}
                >
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {showControls ? (
        <div className="product-gallery-thumbs" aria-label={`${product.name} image gallery`}>
          {images.map((image, index) => (
            <button
              key={`${product.id}-${index + 1}`}
              type="button"
              className={
                index === visibleIndex
                  ? "product-gallery-thumb is-active"
                  : "product-gallery-thumb"
              }
              style={
                {
                  "--gallery-thumb-image": `url(${image})`,
                } as CSSProperties
              }
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1} of ${product.name}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
