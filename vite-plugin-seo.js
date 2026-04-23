/**
 * Vite Plugin: SEO Route Prerenderer
 * 
 * Generates route-specific HTML files at build time by injecting
 * correct meta/OG tags into copies of index.html for each public route.
 * This allows social media bots (Twitter, LinkedIn, Slack, iMessage)
 * to read route-specific metadata without executing JavaScript.
 */

import fs from 'fs';
import path from 'path';

// Route SEO data — mirrors src/data/seo.js but statically for build time
const SITE_NAME = 'Edit & Kraft';
const SITE_URL = 'https://editandkraft.in';
const SITE_DESCRIPTION = 'Premium digital marketing & creative agency specializing in scroll-stopping visual experiences that transform brands across India.';

const ROUTE_SEO = {
  '/work': {
    title: `Our Work — ${SITE_NAME}`,
    description: `A curated collection of our finest craft. Explore projects across social media, motion graphics, YouTube, and short-form content.`,
    ogType: 'website',
  },
  '/services': {
    title: `Services — ${SITE_NAME}`,
    description: `A full spectrum of premium creative services — Content Creation, SEO Optimization, Advertising, Influencer Marketing, Analytics & Reporting.`,
    ogType: 'website',
  },
  '/about': {
    title: `About Us — ${SITE_NAME}`,
    description: `What started as one artist's passion for visual storytelling has grown into a trusted creative force behind some of India's most recognized brands.`,
    ogType: 'profile',
  },
  '/contact': {
    title: `Contact Us — ${SITE_NAME}`,
    description: `Get in touch with ${SITE_NAME}. ${SITE_DESCRIPTION}`,
    ogType: 'website',
  },
};

/**
 * Replace meta tag content in an HTML string.
 */
function replaceMetaTag(html, attribute, name, newContent) {
  const regex = new RegExp(
    `<meta\\s+${attribute}="${name}"\\s+content="[^"]*"\\s*/?>`,
    'i'
  );
  return html.replace(regex, `<meta ${attribute}="${name}" content="${newContent}" />`);
}

/**
 * Replace the <title> tag content.
 */
function replaceTitle(html, newTitle) {
  return html.replace(/<title>[^<]*<\/title>/, `<title>${newTitle}</title>`);
}

/**
 * Replace the canonical link.
 */
function replaceCanonical(html, newUrl) {
  return html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${newUrl}" />`
  );
}

export default function seoPrerender() {
  return {
    name: 'vite-plugin-seo-prerender',
    enforce: 'post',
    apply: 'build',

    closeBundle() {
      const distDir = path.resolve(process.cwd(), 'dist');
      const indexPath = path.join(distDir, 'index.html');

      if (!fs.existsSync(indexPath)) {
        console.warn('[SEO Prerender] dist/index.html not found, skipping.');
        return;
      }

      const baseHtml = fs.readFileSync(indexPath, 'utf-8');

      for (const [route, seo] of Object.entries(ROUTE_SEO)) {
        let html = baseHtml;
        const fullUrl = `${SITE_URL}${route}`;

        // Replace title
        html = replaceTitle(html, seo.title);

        // Replace meta tags
        html = replaceMetaTag(html, 'name', 'description', seo.description);
        html = replaceCanonical(html, fullUrl);

        // Open Graph
        html = replaceMetaTag(html, 'property', 'og:title', seo.title);
        html = replaceMetaTag(html, 'property', 'og:description', seo.description);
        html = replaceMetaTag(html, 'property', 'og:url', fullUrl);
        html = replaceMetaTag(html, 'property', 'og:type', seo.ogType);

        // Twitter
        html = replaceMetaTag(html, 'name', 'twitter:title', seo.title);
        html = replaceMetaTag(html, 'name', 'twitter:description', seo.description);

        // Write to route-specific directory
        const routeDir = path.join(distDir, route.slice(1)); // remove leading /
        fs.mkdirSync(routeDir, { recursive: true });
        fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf-8');

        console.log(`[SEO Prerender] Generated ${route}/index.html`);
      }

      console.log(`[SEO Prerender] ✓ ${Object.keys(ROUTE_SEO).length} route pages generated.`);
    },
  };
}
