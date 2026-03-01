"use client";

import {
  siteConfig,
  type BrandStyleTokens,
  type ButtonStyle,
  type IconBackgroundMode,
  type IconStrokeWidth,
  type IconTheme,
  type RadiusScale,
  type ShapeTheme,
  type ThemeTokens,
} from "@/app/config/site";
import {
  herbCatalog,
  getUniqueCategories,
  starterCategories,
  type HerbProduct,
} from "@/app/data/herbs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface CustomerStory {
  id: string;
  name: string;
  city: string;
  quote: string;
  improvement: string;
}

export interface PaymentRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  method: string;
  status: "PAID" | "PENDING" | "FAILED";
  createdAt: string;
}

export interface MarketplaceLinks {
  amazonUrl: string;
  flipkartUrl: string;
}

interface StorefrontState {
  theme: ThemeTokens;
  brandStyle: BrandStyleTokens;
  products: HerbProduct[];
  categories: string[];
  stories: CustomerStory[];
  payments: PaymentRecord[];
  marketplaces: MarketplaceLinks;
}

interface AddProductInput {
  name: string;
  category: string;
  imageUrl?: string;
  price: number;
  stock: number;
  shortDescription: string;
  botanicalName: string;
  unitLabel: string;
  toneClass: string;
}

interface AddStoryInput {
  name: string;
  city: string;
  quote: string;
  improvement: string;
}

interface RecordPaymentInput {
  orderNumber: string;
  customerName: string;
  amount: number;
  method: string;
  status: "PAID" | "PENDING" | "FAILED";
}

interface StorefrontContextValue {
  state: StorefrontState;
  updateTheme: (patch: Partial<ThemeTokens>) => void;
  resetTheme: () => void;
  updateBrandStyle: (patch: Partial<BrandStyleTokens>) => void;
  resetBrandStyle: () => void;
  addCategory: (name: string) => void;
  removeCategory: (name: string) => void;
  addProduct: (input: AddProductInput) => void;
  removeProduct: (id: string) => void;
  addStory: (input: AddStoryInput) => void;
  removeStory: (id: string) => void;
  recordPayment: (input: RecordPaymentInput) => void;
  updateMarketplaces: (patch: Partial<MarketplaceLinks>) => void;
  resetMarketplaces: () => void;
}

const STORAGE_KEY = "swarna-storefront-v1";
const defaultStories: CustomerStory[] = siteConfig.home.stories.map((story, index) => ({
  id: `story-${index + 1}`,
  ...story,
}));

const defaultState: StorefrontState = {
  theme: siteConfig.theme,
  brandStyle: siteConfig.brandStyle,
  products: herbCatalog,
  categories: getUniqueCategories(herbCatalog, starterCategories),
  stories: defaultStories,
  payments: [],
  marketplaces: siteConfig.marketplaces,
};

const iconThemeValues: IconTheme[] = [
  "botanical-line",
  "ayurvedic-seal",
  "clinical-minimal",
  "premium-mono",
];
const shapeThemeValues: ShapeTheme[] = [
  "seed",
  "leaf",
  "petal",
  "stone",
  "butterfly",
];
const iconBackgroundValues: IconBackgroundMode[] = ["none", "soft", "solid"];
const radiusScaleValues: RadiusScale[] = ["soft", "medium", "bold"];
const iconStrokeValues: IconStrokeWidth[] = [1.5, 2, 2.5];
const buttonStyleValues: ButtonStyle[] = [
  "filled-soft",
  "outline-soft",
  "text-minimal",
];

const themeCssKeyMap: Record<keyof ThemeTokens, string> = {
  bg: "--bg",
  paper: "--paper",
  paperRich: "--paper-rich",
  ink: "--ink",
  inkSoft: "--ink-soft",
  outline: "--outline",
  line: "--line",
  gold: "--gold",
  goldSoft: "--gold-soft",
  sage: "--sage",
  clay: "--clay",
  jade: "--jade",
};

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeImageUrl(value: string | undefined) {
  const normalized = (value ?? "").trim();
  if (!normalized) {
    return undefined;
  }

  if (!/^https?:\/\//i.test(normalized)) {
    return undefined;
  }

  return normalized;
}

function normalizeExternalUrl(value: string | undefined, fallback: string) {
  const normalized = (value ?? "").trim();
  if (!normalized) {
    return fallback;
  }

  if (!/^https?:\/\//i.test(normalized)) {
    return fallback;
  }

  return normalized;
}

function mergeDefaultCatalogProducts(rawProducts: HerbProduct[]) {
  if (!rawProducts.length) {
    return defaultState.products;
  }

  const existingIds = new Set(rawProducts.map((item) => item.id));
  const existingSlugs = new Set(rawProducts.map((item) => item.slug));
  const missingDefaults = defaultState.products.filter(
    (product) => !existingIds.has(product.id) && !existingSlugs.has(product.slug),
  );

  return [...rawProducts, ...missingDefaults];
}

function normalizeState(raw: Partial<StorefrontState>): StorefrontState {
  const theme = { ...defaultState.theme, ...(raw.theme ?? {}) };
  const rawBrand: Partial<BrandStyleTokens> = raw.brandStyle ?? {};
  const brandStyle: BrandStyleTokens = {
    iconTheme: iconThemeValues.includes(rawBrand.iconTheme as IconTheme)
      ? (rawBrand.iconTheme as IconTheme)
      : defaultState.brandStyle.iconTheme,
    shapeTheme: shapeThemeValues.includes(rawBrand.shapeTheme as ShapeTheme)
      ? (rawBrand.shapeTheme as ShapeTheme)
      : defaultState.brandStyle.shapeTheme,
    iconBackground: iconBackgroundValues.includes(
      rawBrand.iconBackground as IconBackgroundMode,
    )
      ? (rawBrand.iconBackground as IconBackgroundMode)
      : defaultState.brandStyle.iconBackground,
    radiusScale: radiusScaleValues.includes(rawBrand.radiusScale as RadiusScale)
      ? (rawBrand.radiusScale as RadiusScale)
      : defaultState.brandStyle.radiusScale,
    iconStrokeWidth: iconStrokeValues.includes(
      Number(rawBrand.iconStrokeWidth) as IconStrokeWidth,
    )
      ? (Number(rawBrand.iconStrokeWidth) as IconStrokeWidth)
      : defaultState.brandStyle.iconStrokeWidth,
    buttonStyle: buttonStyleValues.includes(rawBrand.buttonStyle as ButtonStyle)
      ? (rawBrand.buttonStyle as ButtonStyle)
      : defaultState.brandStyle.buttonStyle,
  };
  const products =
    Array.isArray(raw.products) && raw.products.length > 0
      ? mergeDefaultCatalogProducts(raw.products)
      : defaultState.products;
  const categoriesFromProducts = getUniqueCategories(products);
  const extraCategories = Array.isArray(raw.categories)
    ? raw.categories.map((item) => item.trim()).filter(Boolean)
    : [];
  const categories = getUniqueCategories(
    products,
    [...defaultState.categories, ...categoriesFromProducts, ...extraCategories],
  );
  const stories = Array.isArray(raw.stories) && raw.stories.length > 0 ? raw.stories : defaultState.stories;
  const payments = Array.isArray(raw.payments) ? raw.payments : [];
  const marketplaces = {
    amazonUrl: normalizeExternalUrl(
      raw.marketplaces?.amazonUrl,
      defaultState.marketplaces.amazonUrl,
    ),
    flipkartUrl: normalizeExternalUrl(
      raw.marketplaces?.flipkartUrl,
      defaultState.marketplaces.flipkartUrl,
    ),
  };
  return { theme, brandStyle, products, categories, stories, payments, marketplaces };
}

function getInitialState() {
  return defaultState;
}

export function StorefrontProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StorefrontState>(getInitialState);
  const [hasLoadedStorage, setHasLoadedStorage] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }
      const parsed = JSON.parse(raw) as Partial<StorefrontState>;
      setState(normalizeState(parsed));
    } catch {
      // Keep defaults when persisted payload is malformed.
    } finally {
      setHasLoadedStorage(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedStorage) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hasLoadedStorage]);

  useEffect(() => {
    const root = document.documentElement;
    const entries = Object.entries(state.theme) as Array<[keyof ThemeTokens, string]>;
    for (const [themeKey, value] of entries) {
      root.style.setProperty(themeCssKeyMap[themeKey], value);
    }
  }, [state.theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-icon-theme", state.brandStyle.iconTheme);
    root.setAttribute("data-shape-theme", state.brandStyle.shapeTheme);
    root.setAttribute("data-icon-background", state.brandStyle.iconBackground);
    root.setAttribute("data-radius-scale", state.brandStyle.radiusScale);
    root.setAttribute("data-button-style", state.brandStyle.buttonStyle);
    root.style.setProperty("--icon-stroke-width", String(state.brandStyle.iconStrokeWidth));
  }, [state.brandStyle]);

  const updateTheme = useCallback((patch: Partial<ThemeTokens>) => {
    setState((prev) => ({
      ...prev,
      theme: { ...prev.theme, ...patch },
    }));
  }, []);

  const resetTheme = useCallback(() => {
    setState((prev) => ({ ...prev, theme: defaultState.theme }));
  }, []);

  const updateBrandStyle = useCallback((patch: Partial<BrandStyleTokens>) => {
    setState((prev) => ({
      ...prev,
      brandStyle: { ...prev.brandStyle, ...patch },
    }));
  }, []);

  const resetBrandStyle = useCallback(() => {
    setState((prev) => ({ ...prev, brandStyle: defaultState.brandStyle }));
  }, []);

  const addCategory = useCallback((name: string) => {
    const normalized = name.trim();
    if (!normalized) {
      return;
    }

    setState((prev) => {
      const exists = prev.categories.some(
        (item) => item.toLowerCase() === normalized.toLowerCase(),
      );
      if (exists) {
        return prev;
      }
      return { ...prev, categories: [...prev.categories, normalized] };
    });
  }, []);

  const removeCategory = useCallback((name: string) => {
    setState((prev) => {
      const nextCategories = prev.categories.filter(
        (item) => item.toLowerCase() !== name.toLowerCase(),
      );
      const fallbackCategory = nextCategories[0] ?? defaultState.categories[0];
      const nextProducts = prev.products.map((product) =>
        product.category.toLowerCase() === name.toLowerCase()
          ? { ...product, category: fallbackCategory }
          : product,
      );

      return {
        ...prev,
        categories: nextCategories.length > 0 ? nextCategories : [fallbackCategory],
        products: nextProducts,
      };
    });
  }, []);

  const addProduct = useCallback((input: AddProductInput) => {
    const name = input.name.trim();
    if (!name) {
      return;
    }

    const slugBase = createSlug(name);
    setState((prev) => {
      const existingSlugs = new Set(prev.products.map((item) => item.slug));
      let slug = slugBase || `product-${Date.now()}`;
      let suffix = 1;
      while (existingSlugs.has(slug)) {
        slug = `${slugBase}-${suffix}`;
        suffix += 1;
      }

      const category = input.category.trim() || defaultState.categories[0];
      const imageUrl = normalizeImageUrl(input.imageUrl);
      const product: HerbProduct = {
        id: `custom-${Date.now()}`,
        slug,
        name,
        imageUrl,
        botanicalName: input.botanicalName.trim() || "Herbal Blend",
        category,
        shortDescription: input.shortDescription.trim() || "Premium wellness herb.",
        description: input.shortDescription.trim() || "Premium wellness herb.",
        benefits: ["Supports everyday wellness"],
        usage: "Use as directed by your wellness routine.",
        unitLabel: input.unitLabel.trim() || "100g",
        price: Math.max(1, Math.round(input.price)),
        stock: Math.max(0, Math.round(input.stock)),
        featured: false,
        toneClass: input.toneClass,
      };

      const categories = prev.categories.some((item) => item.toLowerCase() === category.toLowerCase())
        ? prev.categories
        : [...prev.categories, category];

      return {
        ...prev,
        categories,
        products: [product, ...prev.products],
      };
    });
  }, []);

  const removeProduct = useCallback((id: string) => {
    setState((prev) => {
      const nextProducts = prev.products.filter((item) => item.id !== id);
      if (nextProducts.length === prev.products.length) {
        return prev;
      }
      return {
        ...prev,
        products: nextProducts,
      };
    });
  }, []);

  const addStory = useCallback((input: AddStoryInput) => {
    if (!input.name.trim() || !input.quote.trim()) {
      return;
    }

    setState((prev) => ({
      ...prev,
      stories: [
        {
          id: `story-${Date.now()}`,
          name: input.name.trim(),
          city: input.city.trim() || "India",
          quote: input.quote.trim(),
          improvement: input.improvement.trim() || "Positive wellness experience",
        },
        ...prev.stories,
      ],
    }));
  }, []);

  const removeStory = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      stories: prev.stories.filter((story) => story.id !== id),
    }));
  }, []);

  const recordPayment = useCallback((input: RecordPaymentInput) => {
    setState((prev) => ({
      ...prev,
      payments: [
        {
          id: `payment-${Date.now()}`,
          orderNumber: input.orderNumber,
          customerName: input.customerName.trim() || "Customer",
          amount: Math.max(0, Math.round(input.amount)),
          method: input.method,
          status: input.status,
          createdAt: new Date().toISOString(),
        },
        ...prev.payments,
      ],
    }));
  }, []);

  const updateMarketplaces = useCallback((patch: Partial<MarketplaceLinks>) => {
    setState((prev) => ({
      ...prev,
      marketplaces: {
        amazonUrl: normalizeExternalUrl(
          patch.amazonUrl,
          prev.marketplaces.amazonUrl,
        ),
        flipkartUrl: normalizeExternalUrl(
          patch.flipkartUrl,
          prev.marketplaces.flipkartUrl,
        ),
      },
    }));
  }, []);

  const resetMarketplaces = useCallback(() => {
    setState((prev) => ({
      ...prev,
      marketplaces: defaultState.marketplaces,
    }));
  }, []);

  const value = useMemo<StorefrontContextValue>(
    () => ({
      state,
      updateTheme,
      resetTheme,
      updateBrandStyle,
      resetBrandStyle,
      addCategory,
      removeCategory,
      addProduct,
      removeProduct,
      addStory,
      removeStory,
      recordPayment,
      updateMarketplaces,
      resetMarketplaces,
    }),
    [
      state,
      updateTheme,
      resetTheme,
      updateBrandStyle,
      resetBrandStyle,
      addCategory,
      removeCategory,
      addProduct,
      removeProduct,
      addStory,
      removeStory,
      recordPayment,
      updateMarketplaces,
      resetMarketplaces,
    ],
  );

  return <StorefrontContext.Provider value={value}>{children}</StorefrontContext.Provider>;
}

export function useStorefront() {
  const context = useContext(StorefrontContext);
  if (!context) {
    throw new Error("useStorefront must be used within StorefrontProvider");
  }
  return context;
}
