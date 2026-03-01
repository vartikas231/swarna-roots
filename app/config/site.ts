export type SiteIconName =
  | "leaf"
  | "shield-check"
  | "heart-pulse"
  | "sparkles"
  | "stethoscope"
  | "sun"
  | "moon"
  | "sprout"
  | "flask";

export interface ThemeTokens {
  bg: string;
  paper: string;
  paperRich: string;
  ink: string;
  inkSoft: string;
  outline: string;
  line: string;
  gold: string;
  goldSoft: string;
  sage: string;
  clay: string;
  jade: string;
}

export type IconTheme = "botanical-line" | "ayurvedic-seal" | "clinical-minimal" | "premium-mono";
export type ShapeTheme = "seed" | "leaf" | "petal" | "stone" | "butterfly";
export type IconBackgroundMode = "none" | "soft" | "solid";
export type RadiusScale = "soft" | "medium" | "bold";
export type IconStrokeWidth = 1.5 | 2 | 2.5;
export type ButtonStyle = "filled-soft" | "outline-soft" | "text-minimal";

export interface BrandStyleTokens {
  iconTheme: IconTheme;
  shapeTheme: ShapeTheme;
  iconBackground: IconBackgroundMode;
  radiusScale: RadiusScale;
  iconStrokeWidth: IconStrokeWidth;
  buttonStyle: ButtonStyle;
}

export interface SiteConfig {
  brand: {
    name: string;
    siteUrl: string;
    tagline: string;
    heroTitle: string;
    heroDescription: string;
    metaDescription: string;
  };
  navigation: Array<{ href: string; label: string }>;
  support: {
    whatsappNumber: string;
    whatsappMessage: string;
    email: string;
  };
  social: {
    instagramUrl: string;
    linkedinUrl: string;
    facebookUrl: string;
  };
  marketplaces: {
    amazonUrl: string;
    flipkartUrl: string;
  };
  compliance: {
    fssaiLicenseNumber: string;
    certificatePdfUrl: string;
    verifyLicenseUrl: string;
  };
  payment: {
    primaryGateway: string;
    supportedMethods: string[];
  };
  theme: ThemeTokens;
  brandStyle: BrandStyleTokens;
  home: {
    highlights: Array<{ label: string; value: string }>;
    trustPoints: Array<{
      id: string;
      icon: SiteIconName;
      title: string;
      description: string;
    }>;
    healthGoals: Array<{
      id: string;
      icon: SiteIconName;
      title: string;
      description: string;
    }>;
    ingredientStandards: Array<{
      id: string;
      title: string;
      description: string;
    }>;
    stories: Array<{
      name: string;
      city: string;
      quote: string;
      improvement: string;
    }>;
    team: Array<{
      name: string;
      title: string;
      summary: string;
      focus: string[];
    }>;
  };
}

export const siteConfig: SiteConfig = {
  brand: {
    name: "Swarna Roots",
    siteUrl: "https://www.swarnaroots.com",
    tagline: "Modern Ayurveda Luxury",
    heroTitle: "Ancient herbal wisdom, crafted for healthier modern living.",
    heroDescription:
      "Premium herbs, thoughtful formulations, and trusted guidance to help customers build daily wellness rituals that feel elegant and effective.",
    metaDescription:
      "Shop premium Ayurvedic herbs, Himachal teas, wellness oils, spices, candles, and natural daily wellness essentials from Swarna Roots.",
  },
  navigation: [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/cart", label: "Cart" },
    { href: "/checkout", label: "Checkout" },
    { href: "/admin", label: "Admin" },
  ],
  support: {
    whatsappNumber: "917018753282",
    whatsappMessage:
      "Hi Swarna Roots! Please help me choose the right herbs for my wellness goals.",
    email: "swarnarootsteam@gmail.com",
  },
  social: {
    instagramUrl: "https://instagram.com/swarnaroots",
    linkedinUrl: "https://linkedin.com/company/swarnaroots",
    facebookUrl: "https://facebook.com/swarnaroots",
  },
  marketplaces: {
    amazonUrl: "https://www.amazon.in/",
    flipkartUrl: "https://www.flipkart.com/",
  },
  compliance: {
    fssaiLicenseNumber: "FSSAI LIC. NO. UPDATE_REQUIRED",
    certificatePdfUrl: "",
    verifyLicenseUrl: "https://foscos.fssai.gov.in/",
  },
  payment: {
    primaryGateway: "Razorpay",
    supportedMethods: ["UPI", "Credit Cards", "Debit Cards"],
  },
  theme: {
    bg: "#edf3ea",
    paper: "#f8fcf6",
    paperRich: "#e6efe1",
    ink: "#25372d",
    inkSoft: "#506559",
    outline: "#6d7f72",
    line: "#c9d7c7",
    gold: "#a78e5d",
    goldSoft: "#d8c7a2",
    sage: "#92a996",
    clay: "#a97957",
    jade: "#5f7f6c",
  },
  brandStyle: {
    iconTheme: "clinical-minimal",
    shapeTheme: "stone",
    iconBackground: "none",
    radiusScale: "soft",
    iconStrokeWidth: 1.5,
    buttonStyle: "outline-soft",
  },
  home: {
    highlights: [
      { label: "Satisfied customers", value: "18,000+" },
      { label: "Average health rating", value: "4.9/5" },
      { label: "Repeat wellness buyers", value: "74%" },
    ],
    trustPoints: [
      {
        id: "lab-tested",
        icon: "flask",
        title: "Lab-tested purity",
        description: "Every lot is checked for quality consistency before dispatch.",
      },
      {
        id: "clean-formulation",
        icon: "shield-check",
        title: "No unnecessary additives",
        description: "Clean herbal formulations focused on daily wellness outcomes.",
      },
      {
        id: "expert-guidance",
        icon: "stethoscope",
        title: "Guided by wellness experts",
        description: "Customers get practical usage support over WhatsApp.",
      },
    ],
    healthGoals: [
      {
        id: "immunity",
        icon: "sun",
        title: "Immunity support",
        description: "Build resilient daily immunity rituals with trusted herbs.",
      },
      {
        id: "digestion",
        icon: "sparkles",
        title: "Digestive comfort",
        description: "Gentle blends for lighter meals and better digestive flow.",
      },
      {
        id: "stress",
        icon: "moon",
        title: "Stress balance",
        description: "Calming adaptogenic options for rest, recovery, and focus.",
      },
      {
        id: "daily-wellness",
        icon: "sprout",
        title: "Daily vitality",
        description: "Nourishing botanicals for sustainable long-term wellness.",
      },
    ],
    ingredientStandards: [
      {
        id: "source",
        title: "Farm-sourced with traceability",
        description:
          "Small grower clusters, seasonal sourcing, and transparent origin practices.",
      },
      {
        id: "processing",
        title: "Low-heat mindful processing",
        description:
          "Designed to preserve aroma, active compounds, and natural character.",
      },
      {
        id: "packaging",
        title: "Premium freshness packaging",
        description:
          "Barrier-safe packs to maintain potency, aroma, and shelf stability.",
      },
    ],
    stories: [
      {
        name: "Anjali Mehra",
        city: "Pune",
        quote:
          "Tulsi and turmeric blends became part of my daily routine. I feel lighter and more consistent with my health now.",
        improvement: "Improved seasonal immunity in 6 weeks",
      },
      {
        name: "Rohit Sharma",
        city: "Gurugram",
        quote:
          "Ashwagandha and brahmi helped me manage stress after long workdays. The quality feels premium and trustworthy.",
        improvement: "Better sleep and calmer evenings",
      },
      {
        name: "Sanya Kulkarni",
        city: "Bengaluru",
        quote:
          "The digestive herbs and tea infusions worked beautifully after meals. Support team also guided me on what to pick.",
        improvement: "Less bloating and smoother digestion",
      },
    ],
    team: [
      {
        name: "Raj Kumar Sharma",
        title: "Root & Herb Sourcing Lead",
        summary:
          "A hardworking Himachali with deep practical knowledge of roots and herbs, and a strong connection to dairy culture and farming life.",
        focus: ["Herb knowledge", "Farming insight", "Dairy culture"],
      },
      {
        name: "Mouli Sharma",
        title: "Natural Pharma Research",
        summary:
          "A pharmacy student who enjoys learning new things and exploring the therapeutic use of natural products in modern wellness.",
        focus: ["Pharmacy studies", "Natural product research", "Learning & innovation"],
      },
      {
        name: "Pushpa Sharma",
        title: "Finance & Operations",
        summary:
          "A disciplined, hardworking finance lead with strong experience in farming and farmer-related activities.",
        focus: ["Finance planning", "Rural operations", "Farmer ecosystem"],
      },
    ],
  },
};
