"use client";

import { useCart } from "@/app/components/cart-provider";
import { siteConfig } from "@/app/config/site";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function StoreHeader() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const accountHref = session?.user ? "/account" : "/login";
  const accountLabel = session?.user ? "Account" : "Sign in";

  return (
    <header className="store-header reveal">
      <Link href="/" className="brand-link">
        <span className="brand-icon" aria-hidden="true">
          <Image
            src={siteConfig.brand.logoUrl}
            alt=""
            width={34}
            height={34}
            className="brand-logo-image"
            priority
          />
        </span>
        {siteConfig.brand.name}
      </Link>

      <button
        type="button"
        className="header-menu-toggle"
        aria-expanded={mobileMenuOpen}
        aria-controls="primary-navigation"
        aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setMobileMenuOpen((prev) => !prev)}
      >
        {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        <span>Menu</span>
      </button>

      <nav
        id="primary-navigation"
        className={mobileMenuOpen ? "header-nav is-open" : "header-nav"}
        aria-label="Primary navigation"
      >
        {siteConfig.navigation.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "is-active" : undefined}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link href="/cart" className="cart-pill">
        <ShoppingBag size={16} />
        <span>Cart</span>
        <strong>{cartCount}</strong>
      </Link>

      <Link href={accountHref} className="cart-pill" onClick={() => setMobileMenuOpen(false)}>
        <span>{accountLabel}</span>
      </Link>
    </header>
  );
}
