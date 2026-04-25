import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getSEOForRoute } from "../../data/seo";

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  author: string;
  canonicalUrl: string;
  ogType: string;
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  ogSiteName: string;
  ogImage: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  lastModified: string;
  themeColor: string;
  robots?: string;
}

interface DynamicSEOProps {
  overrides?: Record<string, any>;
}

export default function DynamicSEO({ overrides = {} }: DynamicSEOProps) {
  const { pathname } = useLocation();
  const seo = getSEOForRoute(pathname, overrides) as SEOData;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <meta name="author" content={seo.author} />
      <meta name="theme-color" content={seo.themeColor} />

      {/* Mobile Meta */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />

      {/* Canonical */}
      <link rel="canonical" href={seo.canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={seo.ogType} />
      <meta property="og:title" content={seo.ogTitle} />
      <meta property="og:description" content={seo.ogDescription} />
      <meta property="og:url" content={seo.ogUrl} />
      <meta property="og:site_name" content={seo.ogSiteName} />
      <meta property="og:image" content={seo.ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={seo.twitterCard} />
      <meta name="twitter:title" content={seo.twitterTitle} />
      <meta name="twitter:description" content={seo.twitterDescription} />
      <meta name="twitter:image" content={seo.twitterImage} />

      {/* Freshness Signal */}
      <meta name="last-modified" content={seo.lastModified} />

      {/* Robots */}
      <meta name="robots" content={seo.robots || "index, follow"} />
    </Helmet>
  );
}
