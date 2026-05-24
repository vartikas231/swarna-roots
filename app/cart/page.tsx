"use client";

import { useCart } from "@/app/components/cart-provider";
import { getProductImages } from "@/app/data/herbs";
import { formatPrice } from "@/app/lib/format";
import Link from "next/link";

export default function CartPage() {
  const { lineItems, subtotal, setQuantity, removeItem, clearCart } = useCart();

  const shipping = subtotal > 0 && subtotal < 999 ? 60 : 0;
  const total = subtotal + shipping;

  if (lineItems.length === 0) {
    return (
      <section className="section-card empty-state reveal reveal-delay-1">
        <h1>Your cart is empty</h1>
        <p>Add a few herbs from the catalog to start your order.</p>
        <Link href="/shop" className="btn btn-primary">
          Browse herbs
        </Link>
      </section>
    );
  }

  return (
    <div className="checkout-layout">
      <section className="section-card reveal reveal-delay-1">
        <div className="section-head">
          <h1 className="page-title">Your cart</h1>
          <button type="button" className="text-btn" onClick={clearCart}>
            Clear cart
          </button>
        </div>

        <div className="cart-items">
          {lineItems.map((item) => {
            const primaryImage = getProductImages(item.product)[0];

            return (
              <article key={item.productId} className="cart-item">
                <Link
                  href={`/shop/${item.product.slug}`}
                  className={`cart-thumb ${item.product.toneClass} ${primaryImage ? "cart-thumb--photo" : ""}`}
                  aria-label={`Open ${item.product.name}`}
                >
                  {primaryImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={primaryImage}
                      alt={item.product.name}
                      className="cart-thumb-image"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </Link>
                <div className="cart-copy">
                  <h2>
                    <Link href={`/shop/${item.product.slug}`}>{item.product.name}</Link>
                  </h2>
                  <p>{item.product.unitLabel}</p>
                  <strong>{formatPrice(item.product.price)}</strong>
                </div>

                <div className="qty-control">
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity - 1)}
                    aria-label={`Decrease quantity of ${item.product.name}`}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(item.productId, item.quantity + 1)}
                    aria-label={`Increase quantity of ${item.product.name}`}
                  >
                    +
                  </button>
                </div>

                <div className="cart-line-price">
                  <strong>{formatPrice(item.lineTotal)}</strong>
                  <button
                    type="button"
                    className="text-btn"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <aside className="section-card summary-card reveal reveal-delay-2">
        <h2>Order summary</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <strong>{formatPrice(subtotal)}</strong>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <strong>{shipping === 0 ? "Free" : formatPrice(shipping)}</strong>
        </div>
        <div className="summary-row summary-row--total">
          <span>Total</span>
          <strong>{formatPrice(total)}</strong>
        </div>
        <p className="muted-text">Free shipping on orders above {formatPrice(999)}.</p>
        <Link href="/checkout" className="btn btn-primary btn-wide">
          Continue to checkout
        </Link>
      </aside>
    </div>
  );
}
