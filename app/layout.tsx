import type { Metadata } from "next";
import { AuthSessionProvider } from "@/app/components/auth-session-provider";
import { CartProvider } from "@/app/components/cart-provider";
import { StorefrontProvider } from "@/app/components/storefront-provider";
import { siteConfig } from "@/app/config/site";
import { getMetadataBase, toAbsoluteUrl } from "@/app/lib/seo";
import { StoreHeader } from "@/app/components/store-header";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";
import "./globals.css";

function resolvePublicUrl(value: string | undefined, fallback: string) {
  const normalized = (value ?? "").trim();
  return normalized || fallback;
}

function resolvePublicValue(value: string | undefined, fallback: string) {
  const normalized = (value ?? "").trim();
  return normalized || fallback;
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: `${siteConfig.brand.name} | Premium Ayurvedic Herbs`,
    template: `%s | ${siteConfig.brand.name}`,
  },
  description: siteConfig.brand.metaDescription,
  applicationName: siteConfig.brand.name,
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "en-US": "/",
      "x-default": "/",
    },
  },
  keywords: [
    "Ayurveda",
    "herbal products",
    "wellness herbs",
    "natural health",
    "Swarna Roots",
    "herbal store India",
    "Himachal tea",
    "wellness candles",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    alternateLocale: ["en_US"],
    url: toAbsoluteUrl("/"),
    siteName: siteConfig.brand.name,
    title: `${siteConfig.brand.name} | Premium Ayurvedic Herbs`,
    description: siteConfig.brand.metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.brand.name} | Premium Ayurvedic Herbs`,
    description: siteConfig.brand.metaDescription,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? siteConfig.support.whatsappNumber;
  const whatsappMessage = encodeURIComponent(
    siteConfig.support.whatsappMessage,
  );
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
  const supportEmail = resolvePublicValue(
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
    siteConfig.support.email,
  );
  const supportEmailLink = `mailto:${supportEmail}`;
  const socialConfig = {
    instagramUrl: resolvePublicUrl(
      process.env.NEXT_PUBLIC_INSTAGRAM_URL,
      siteConfig.social.instagramUrl,
    ),
    linkedinUrl: resolvePublicUrl(
      process.env.NEXT_PUBLIC_LINKEDIN_URL,
      siteConfig.social.linkedinUrl,
    ),
    facebookUrl: resolvePublicUrl(
      process.env.NEXT_PUBLIC_FACEBOOK_URL,
      siteConfig.social.facebookUrl,
    ),
  };
  const socialLinks = [
    {
      href: socialConfig.instagramUrl,
      label: "Instagram",
      icon: Instagram,
    },
    {
      href: socialConfig.linkedinUrl,
      label: "LinkedIn",
      icon: Linkedin,
    },
    {
      href: socialConfig.facebookUrl,
      label: "Facebook",
      icon: Facebook,
    },
  ].filter((item) => /^https?:\/\//i.test(item.href));
  const complianceConfig = {
    fssaiLicenseNumber: resolvePublicValue(
      process.env.NEXT_PUBLIC_FSSAI_LICENSE_NUMBER,
      siteConfig.compliance.fssaiLicenseNumber,
    ),
    certificatePdfUrl: resolvePublicUrl(
      process.env.NEXT_PUBLIC_FSSAI_CERTIFICATE_URL,
      siteConfig.compliance.certificatePdfUrl,
    ),
    verifyLicenseUrl: resolvePublicUrl(
      process.env.NEXT_PUBLIC_FSSAI_VERIFY_URL,
      siteConfig.compliance.verifyLicenseUrl,
    ),
  };
  const hasCertificateLink = /^https?:\/\//i.test(complianceConfig.certificatePdfUrl);
  const hasVerifyLink = /^https?:\/\//i.test(complianceConfig.verifyLicenseUrl);

  return (
    <html lang="en">
      <body className="antialiased">
        <AuthSessionProvider>
          <StorefrontProvider>
            <CartProvider>
              <div className="app-shell">
                <div className="ambient-orb ambient-orb--one" aria-hidden="true" />
                <div className="ambient-orb ambient-orb--two" aria-hidden="true" />
                <StoreHeader />
                <main className="page-shell">{children}</main>
                <footer className="store-footer">
                  <div>
                    <p>{siteConfig.brand.name} | Small-batch herbs. Updated every week.</p>
                    <div className="footer-links">
                      <Link href="/shop">Browse catalog</Link>
                      <Link href="/checkout">Checkout</Link>
                      <a href={supportEmailLink}>Connect over email</a>
                    </div>
                    <details className="footer-compliance">
                      <summary>FSSAI Trust &amp; Compliance</summary>
                      <ul className="footer-compliance-list">
                        <li>
                          <span>FSSAI License Number</span>
                          <strong>{complianceConfig.fssaiLicenseNumber}</strong>
                        </li>
                        <li>
                          {hasCertificateLink ? (
                            <a
                              href={complianceConfig.certificatePdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View FSSAI Certificate (PDF)
                            </a>
                          ) : (
                            <span>FSSAI Certificate link will be updated soon.</span>
                          )}
                        </li>
                        {hasVerifyLink ? (
                          <li>
                            <a
                              href={complianceConfig.verifyLicenseUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Verify FSSAI License (FoSCoS)
                            </a>
                          </li>
                        ) : null}
                      </ul>
                    </details>
                  </div>
                  <div className="footer-socials">
                    {socialLinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="footer-social-link"
                          aria-label={`Visit ${siteConfig.brand.name} on ${item.label}`}
                        >
                          <Icon size={14} aria-hidden="true" />
                          <span>{item.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </footer>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-float"
                  aria-label="Chat with Swarna Roots support on WhatsApp"
                >
                  WhatsApp Support
                </a>
              </div>
            </CartProvider>
          </StorefrontProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
