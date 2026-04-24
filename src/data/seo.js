// ============================================================
// DYNAMIC SEO CONFIGURATION — AUTO-ADAPTS FROM CONTENT DATA
// ============================================================
// This file derives ALL SEO metadata from content.js.
// When content changes, SEO updates automatically.
// ============================================================
import { SITE, SERVICES, PORTFOLIO, ABOUT, FOOTER, TESTIMONIALS, PLANS } from "./content";

// ---------------------------------------------------------------------------
// Dynamic keyword harvesting — pulled from live content, not hard-coded
// ---------------------------------------------------------------------------
const BASE_KEYWORDS = [
  "digital marketing agency India",
  "creative agency India",
  "premium brand design",
  "motion graphics India",
  "social media marketing India",
  "video production company",
  "Edit and Kraft",
  "Edit & Kraft",
  "scroll-stopping visuals",
  "seo",
  "digital marketing",
  "marketing",
  "affiliate marketing",
  "digital",
  "digital marketing course",
  "digital marketing classes",
  "digital marketing agency",
  "network marketing",
  "ppc",
  "social media marketing",
  "marketing is",
  "marketing strategy",
  "content marketing",
  "digitize",
  "digital marketing online",
  "inbound marketing",
  "market research",
  "email marketing",
  "video marketing",
  "digital marketing jobs",
  "digital marketing company",
  "digital marketing firms",
  "digital marketing services"
];

// Auto-extract keywords from service titles
const serviceKeywords = SERVICES.items.map((service) => service.title.toLowerCase());

// Auto-extract keywords from portfolio categories
const portfolioKeywords = PORTFOLIO.categories
  .filter((c) => c !== "All")
  .map((c) => c.toLowerCase());

// Combine and deduplicate
const ALL_KEYWORDS = [...new Set([...BASE_KEYWORDS, ...portfolioKeywords, ...serviceKeywords])];

// ---------------------------------------------------------------------------
// Build timestamp — updates every build for freshness signals
// ---------------------------------------------------------------------------
const BUILD_DATE = new Date().toISOString();

// ---------------------------------------------------------------------------
// Canonical base URL
// ---------------------------------------------------------------------------
const CANONICAL_BASE = SITE.website;

// ---------------------------------------------------------------------------
// Per-route SEO configuration
// Each route derives its description from actual content data
// ---------------------------------------------------------------------------
const ROUTE_SEO = {
  "/": {
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    keywords: ALL_KEYWORDS.slice(0, 15).join(", "),
    ogType: "website",
  },
  "/work": {
    title: `Our Work — ${SITE.name}`,
    description: `${PORTFOLIO.sectionSubtitle} Explore ${PORTFOLIO.projects.length}+ projects across ${portfolioKeywords.join(", ")}.`,
    keywords: [...portfolioKeywords, "portfolio", "creative work", "case studies"].join(", "),
    ogType: "website",
  },
  "/services": {
    title: `Services — ${SITE.name}`,
    description: `${SERVICES.sectionSubtitle} Choose from ${SERVICES.items.map((s) => s.shortTitle || s.title).join(", ")}.`,
    keywords: [...serviceKeywords.slice(0, 10), "digital marketing services", "creative services"].join(", "),
    ogType: "website",
  },
  "/about": {
    title: `About Us — ${SITE.name}`,
    description: ABOUT.intro,
    keywords: ["about Edit and Kraft", "creative agency story", "brand design India", "digital marketing history"].join(", "),
    ogType: "profile",
  },
  "/contact": {
    title: `Contact Us — ${SITE.name}`,
    description: `Get in touch with ${SITE.name}. ${SITE.description}`,
    keywords: ["contact Edit and Kraft", "hire creative agency", "digital marketing inquiry", "brand consultation"].join(", "),
    ogType: "website",
  },
};

/**
 * Get the SEO configuration for a given route.
 * Automatically adapts based on content.js data.
 *
 * @param {string} pathname - The current route pathname (e.g., "/", "/work")
 * @param {object} [overrides] - Optional overrides for any SEO field
 * @returns {object} Complete SEO configuration
 */
export function getSEOForRoute(pathname = "/", overrides = {}) {
  const routeConfig = ROUTE_SEO[pathname] || ROUTE_SEO["/"];
  return {
    title: routeConfig.title,
    description: routeConfig.description,
    keywords: routeConfig.keywords,
    canonicalUrl: `${CANONICAL_BASE}${pathname === "/" ? "/" : pathname}`,
    ogTitle: routeConfig.title,
    ogDescription: routeConfig.description,
    ogType: routeConfig.ogType,
    ogUrl: `${CANONICAL_BASE}${pathname === "/" ? "/" : pathname}`,
    ogSiteName: SITE.name,
    ogImage: `${CANONICAL_BASE}/og-image.jpg`,
    twitterCard: "summary_large_image",
    twitterTitle: routeConfig.title,
    twitterDescription: routeConfig.description,
    twitterImage: `${CANONICAL_BASE}/og-image.jpg`,
    author: SITE.name,
    lastModified: BUILD_DATE,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Structured Data Generators — all derived from content.js
// ---------------------------------------------------------------------------

/**
 * Generate Organization JSON-LD schema.
 * Social profiles auto-update from FOOTER.socialLinks.
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.website,
    logo: `${SITE.website}/favicon.svg`,
    description: SITE.description,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      addressCountry: SITE.location,
    },
    sameAs: FOOTER.socialLinks.map((link) => link.url),
    foundingDate: ABOUT.milestones[0]?.year || "2016",
  };
}

/**
 * Generate WebSite JSON-LD schema with SearchAction.
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.website,
    description: SITE.description,
    publisher: {
      "@type": "Organization",
      name: SITE.name,
    },
  };
}

/**
 * Generate Service JSON-LD schemas — one per service from content.js.
 * When services are added/removed in content.js, schema auto-adapts.
 */
export function getServiceSchemas() {
  return SERVICES.items.map((service) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    provider: {
      "@type": "Organization",
      name: SITE.name,
    },
    serviceType: service.shortTitle || service.title,
    areaServed: {
      "@type": "Country",
      name: SITE.location,
    },
    offers: PLANS.filter(plan => plan.id !== 'custom').map(plan => ({
      "@type": "Offer",
      "name": plan.name,
      "description": plan.description,
      "price": plan.purchaseOptions[0].price.replace(/[^0-9]/g, ''),
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "url": `${SITE.website}/services`
    }))
  }));
}

/**
 * Generate BreadcrumbList JSON-LD schema for a given route.
 * Adapts dynamically based on the current pathname.
 */
export function getBreadcrumbSchema(pathname = "/") {
  const breadcrumbs = [
    { name: "Home", url: SITE.website },
  ];

  if (pathname !== "/") {
    const routeConfig = ROUTE_SEO[pathname];
    const pageName = routeConfig
      ? routeConfig.title.split(" — ")[0]
      : pathname.replace("/", "").charAt(0).toUpperCase() + pathname.slice(2);
    
    breadcrumbs.push({
      name: pageName,
      url: `${SITE.website}${pathname}`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate CreativeWork JSON-LD schemas — one per portfolio item from content.js.
 * When portfolio items are added/removed in content.js, schema auto-adapts.
 */
export function getCreativeWorkSchemas() {
  return PORTFOLIO.projects.map((project) => ({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    creator: {
      "@type": "Organization",
      name: SITE.name,
    },
    dateCreated: project.year,
    about: project.category,
    client: project.client,
  }));
}

/**
 * Generate Review JSON-LD schemas from TESTIMONIALS in content.js.
 * This allows Google to show star ratings or review snippets in search.
 */
export function getReviewSchemas() {
  return TESTIMONIALS.map((testimonial) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "Organization",
      "name": SITE.name
    },
    "reviewBody": testimonial.quote,
    "author": {
      "@type": "Person",
      "name": testimonial.author
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": "5",
      "bestRating": "5"
    }
  }));
}

/**
 * Get all structured data schemas for a given route.
 * Returns an array of JSON-LD objects ready for injection.
 */
export function getAllSchemasForRoute(pathname = "/") {
  const schemas = [
    getOrganizationSchema(),
    getWebSiteSchema(),
    getBreadcrumbSchema(pathname),
  ];

  // Add service and review schemas on home page
  if (pathname === "/") {
    schemas.push(...getServiceSchemas());
    schemas.push(...getReviewSchemas());
  }

  // Add service schemas on services page
  if (pathname === "/services") {
    schemas.push(...getServiceSchemas());
  }

  // Add creative work schemas on work page
  if (pathname === "/work") {
    schemas.push(...getCreativeWorkSchemas());
  }

  return schemas;
}

// Export constants for use in build tools
export { ALL_KEYWORDS, BUILD_DATE, CANONICAL_BASE, ROUTE_SEO };
