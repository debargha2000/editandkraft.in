// ============================================================
// DYNAMIC SEO COMPONENT
// ============================================================
// Automatically injects the correct <head> meta tags for each
// route. Reads from seo.js which derives everything from content.js.
// When content changes → SEO adapts automatically.
// ============================================================

import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getSEOForRoute } from "../../data/seo";

/**
 * DynamicSEO — Drop into any page/layout to get route-aware SEO.
 *
 * @param {object} props
 * @param {object} [props.overrides] - Optional per-page overrides for any SEO field
 */
export default function DynamicSEO({ overrides = {} }) {
  const { pathname } = useLocation();
  const seo = getSEOForRoute(pathname, overrides);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="author" content={seo.author} />

      {/* Canonical */}
      <link rel="canonical" href={seo.canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={seo.ogType} />
      <meta property="og:title" content={seo.ogTitle} />
      <meta property="og:description" content={seo.ogDescription} />
      <meta property="og:url" content={seo.ogUrl} />
      <meta property="og:site_name" content={seo.ogSiteName} />
      <meta property="og:image" content={seo.ogImage} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={seo.twitterCard} />
      <meta name="twitter:title" content={seo.twitterTitle} />
      <meta name="twitter:description" content={seo.twitterDescription} />
      <meta name="twitter:image" content={seo.twitterImage} />

      {/* Freshness Signal */}
      <meta name="last-modified" content={seo.lastModified} />

      {/* Robots — allow indexing by default */}
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
}
