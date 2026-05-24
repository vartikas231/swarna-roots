"use client";

import { HealthIcon } from "@/app/components/health-icon";
import { MediaBoard } from "@/app/components/media-board";
import { useStorefront } from "@/app/components/storefront-provider";
import { siteConfig } from "@/app/config/site";
import { getCategoryPathByName } from "@/app/lib/category-seo";
import Link from "next/link";
import { useMemo, type CSSProperties } from "react";

export function HomePageClient() {
  const { state } = useStorefront();
  const categoryQuickLinks = useMemo(() => {
    return state.categories
      .map((category) => ({
        name: category,
        count: state.products.filter((product) => product.category === category).length,
        href: getCategoryPathByName(category) ?? "/shop",
      }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [state.categories, state.products]);
  const supportWhatsappHref = useMemo(() => {
    return `https://wa.me/${siteConfig.support.whatsappNumber}?text=${encodeURIComponent(siteConfig.support.whatsappMessage)}`;
  }, []);
  const marketplaceLinks = useMemo(() => {
    const links = [
      {
        label: "Shop on Amazon",
        href: state.marketplaces.amazonUrl,
      },
      {
        label: "Shop on Flipkart",
        href: state.marketplaces.flipkartUrl,
      },
    ];
    return links.filter((item) => /^https?:\/\//i.test(item.href));
  }, [state.marketplaces.amazonUrl, state.marketplaces.flipkartUrl]);
  const heroCollections = useMemo(() => {
    const collectionCopy = [
      {
        name: "Himachal Teas",
        eyebrow: "Mountain freshness",
        description: "Small-batch tea selections inspired by Palampur hills and slower daily rituals.",
        accentClass: "hero-collection-card--tea",
      },
      {
        name: "Wellness Candles",
        eyebrow: "Evening ritual",
        description: "Warm botanical candles for gifting, unwinding, and calmer evening spaces.",
        accentClass: "hero-collection-card--candle",
      },
      {
        name: "Botanical Soaps",
        eyebrow: "Bath care",
        description: "Clean herbal soaps made for simple, natural bath care routines.",
        accentClass: "hero-collection-card--soap",
      },
      {
        name: "Seeds",
        eyebrow: "Grow at home",
        description: "Seed collections that connect the brand back to roots, farming, and fresh beginnings.",
        accentClass: "hero-collection-card--seed",
      },
    ];

    return collectionCopy.map((item) => {
      const match = categoryQuickLinks.find((category) => category.name === item.name);
      return {
        ...item,
        count: match?.count ?? 0,
        href: match?.href ?? "/shop",
      };
    });
  }, [categoryQuickLinks]);
  const spotlightCollection = heroCollections[0];
  const supportingCollections = heroCollections.slice(1);
  const curatedCategories = categoryQuickLinks.slice(0, 10);

  return (
    <div className="page-stack">
      <section className="hero-panel hero-panel--landing reveal reveal-delay-1">
        <div className="hero-copy">
          <p className="eyebrow">{siteConfig.brand.tagline}</p>
          <span className="hero-kicker">Small-batch wellness essentials from Himachal roots</span>
          <h1>Premium herbs, teas, candles, soaps, and everyday care rituals.</h1>
          <p className="hero-intro">
            Shop trusted botanicals, mountain teas, natural bath care, and thoughtful wellness
            gifts with clear guidance from the Swarna Roots family.
          </p>

          <div className="hero-feature-strip">
            {siteConfig.home.trustPoints.map((point) => (
              <article key={point.id} className="hero-feature-card">
                <span className="icon-badge" aria-hidden="true">
                  <HealthIcon name={point.icon} size={16} />
                </span>
                <div>
                  <strong>{point.title}</strong>
                  <p>{point.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="hero-actions">
            <Link className="btn btn-primary" href="/shop">
              Explore all collections
            </Link>
            <Link className="btn btn-outline" href="/track-order">
              Track an order
            </Link>
          </div>
          {marketplaceLinks.length > 0 ? (
            <div className="marketplace-actions">
              {marketplaceLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                >
                  {item.label}
                </a>
              ))}
            </div>
          ) : null}

          <div className="hero-stats-grid" aria-label="Storefront highlights">
            {siteConfig.home.highlights.map((item) => (
              <article key={item.label} className="hero-stat-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        </div>

        <div className="hero-media-stage">
          <MediaBoard className="hero-media-canvas" items={state.media.heroMediaUrls} />

          <div className="hero-media-grid">
            {spotlightCollection ? (
              <Link
                href={spotlightCollection.href}
                className="hero-collection-card hero-collection-card--spotlight"
              >
                <span className="hero-collection-eyebrow">{spotlightCollection.eyebrow}</span>
                <strong>{spotlightCollection.name}</strong>
                <p>{spotlightCollection.description}</p>
                <div className="hero-collection-meta">
                  <span>{spotlightCollection.count} live products</span>
                  <span>Open collection</span>
                </div>
              </Link>
            ) : null}

            {supportingCollections.map((collection) => (
              <Link
                key={collection.name}
                href={collection.href}
                className={`hero-collection-card ${collection.accentClass}`}
              >
                <span className="hero-collection-eyebrow">{collection.eyebrow}</span>
                <strong>{collection.name}</strong>
                <p>{collection.description}</p>
                <div className="hero-collection-meta">
                  <span>{collection.count} live products</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-card home-category-hub reveal reveal-delay-2">
        <div className="home-category-hub-copy">
          <p className="eyebrow">Store Sections</p>
          <h2>Shop every ritual in one place</h2>
          <p>
            Find teas, candles, soaps, loofahs, seeds, oils, herbs, and pantry wellness
            staples through focused collections built for everyday routines.
          </p>

          <div className="sidebar-support-card">
            <p className="sidebar-support-label">Need a recommendation?</p>
            <strong>Talk to a real person before ordering.</strong>
            <p>
              Use WhatsApp or email and we can guide customers toward the right routine,
              gifting option, or wellness section.
            </p>
            <div className="sidebar-support-actions">
              <a href={supportWhatsappHref} target="_blank" rel="noopener noreferrer">
                WhatsApp support
              </a>
              <a href={`mailto:${siteConfig.support.email}`}>Connect over email</a>
            </div>
          </div>

          <div className="market-ribbon" aria-label="Market highlights">
            <div className="market-ribbon-track">
              <span>
                <HealthIcon name="sprout" size={14} /> Fresh farm lots every week
              </span>
              <span>
                <HealthIcon name="heart-pulse" size={14} /> Trusted by family wellness buyers
              </span>
              <span>
                <HealthIcon name="flask" size={14} /> Small-batch quality checked herbs
              </span>
              <span>
                <HealthIcon name="sun" size={14} /> Natural routines for daily vitality
              </span>
            </div>
          </div>
        </div>

        <nav className="home-category-grid" aria-label="Homepage category shortcuts">
          {curatedCategories.map((item) => (
            <Link key={item.name} href={item.href} className="home-category-link">
              <span>{item.name}</span>
              <strong>{item.count}</strong>
            </Link>
          ))}
        </nav>
      </section>

      <section className="section-card reveal reveal-delay-2">
        <div className="section-head">
          <h2>Why customers trust this store</h2>
        </div>
        <div className="trust-marquee" aria-label="Customer trust highlights">
          <div className="trust-marquee-track">
            {[...siteConfig.home.trustPoints, ...siteConfig.home.trustPoints].map((point, index) => (
              <article
                key={`${point.id}-${index}`}
                className="trust-card trust-card--marquee"
                style={{ "--i": index } as CSSProperties}
              >
                <span className="icon-badge" aria-hidden="true">
                  <HealthIcon name={point.icon} size={16} />
                </span>
                <h3>{point.title}</h3>
                <p>{point.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-card reveal reveal-delay-2">
        <div className="section-head">
          <h2>Shop by health goals</h2>
          <Link href="/shop">View all products</Link>
        </div>
        <div className="goals-grid">
          {siteConfig.home.healthGoals.map((goal, index) => (
            <article
              key={goal.id}
              className="goal-card reveal-stagger"
              style={{ "--i": index } as CSSProperties}
            >
              <span className="icon-badge icon-badge--goal" aria-hidden="true">
                <HealthIcon name={goal.icon} size={18} />
              </span>
              <h3>{goal.title}</h3>
              <p>{goal.description}</p>
              <Link href="/shop" className="text-link">
                Explore products
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card reveal reveal-delay-3">
        <div className="section-head">
          <h2>Ingredient quality standards</h2>
        </div>
        <div className="trust-grid">
          {siteConfig.home.ingredientStandards.map((item, index) => (
            <article
              key={item.id}
              className="trust-card reveal-stagger"
              style={{ "--i": index } as CSSProperties}
            >
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card reveal reveal-delay-3">
        <div className="section-head">
          <h2>Customer satisfaction stories</h2>
          <Link href="/shop">Join our wellness community</Link>
        </div>
        {state.media.reviewMediaUrls.length > 0 ? (
          <MediaBoard className="review-media-board" items={state.media.reviewMediaUrls} />
        ) : null}
        <div className="stories-grid">
          {state.stories.map((story, index) => (
            <article
              key={story.id}
              className="story-card reveal-stagger"
              style={{ "--i": index } as CSSProperties}
            >
              <p>{story.quote}</p>
              <strong>
                {story.name}, {story.city}
              </strong>
              <span>{story.improvement}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="section-card reveal reveal-delay-3">
        <div className="section-head">
          <h2>Our family team</h2>
        </div>
        <p className="page-subtitle">
          We run Swarna Roots side by side with our day-to-day work, guided by one shared
          family passion: helping people build healthier routines through herbs.
        </p>
        <div className="team-grid">
          {siteConfig.home.team.map((member, index) => (
            <article
              key={member.name}
              className="team-card reveal-stagger"
              style={{ "--i": index } as CSSProperties}
            >
              <h3>{member.name}</h3>
              <p className="team-title">{member.title}</p>
              <p>{member.summary}</p>
              <div className="category-badges">
                {member.focus.map((item) => (
                  <span key={item} className="tag">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
