"use client";

import { useCart } from "@/app/components/cart-provider";
import { HealthIcon } from "@/app/components/health-icon";
import { siteConfig } from "@/app/config/site";
import { ShoppingBag } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function StoreHeader() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { data: session } = useSession();
  const accountHref = session?.user ? "/account" : "/login";
  const accountLabel = session?.user ? "Account" : "Login";

  return (
    <header className="store-header reveal">
      <Link href="/" className="brand-link">
        <span className="brand-icon" aria-hidden="true">
          <HealthIcon name="leaf" size={14} />
        </span>
        {siteConfig.brand.name}
      </Link>

      <nav className="header-nav" aria-label="Primary navigation">
        {siteConfig.navigation.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link key={item.href} href={item.href} className={active ? "is-active" : undefined}>
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

      <Link href={accountHref} className="cart-pill">
        <span>{accountLabel}</span>
      </Link>
    </header>
  );
}
