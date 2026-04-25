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
import { getSEOForRoute } from './src/data/seo.js';

const ROUTES = ['/', '/work', '/services', '/about', '/contact', '/admin/login'];

/**
 * Replace meta tag content in an HTML string.
 */
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function insertBeforeHeadClose(html, tag) {
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

function replaceMetaTag(html, attribute, name, newContent) {
  const regex = new RegExp(`<meta[^>]*${attribute}="${escapeRegExp(name)}"[^>]*>`, 'i');
  const tag = `<meta ${attribute}="${name}" content="${newContent}" />`;
  if (regex.test(html)) {
    return html.replace(regex, tag);
  }
  return insertBeforeHeadClose(html, tag);
}

/**
 * Replace the <title> tag content.
 */
function replaceTitle(html, newTitle) {
  const titleTag = /<title>[^<]*<\/title>/i;
  if (titleTag.test(html)) {
    return html.replace(titleTag, `<title>${newTitle}</title>`);
  }
  return insertBeforeHeadClose(html, `<title>${newTitle}</title>`);
}

/**
 * Replace or insert the canonical link.
 */
function replaceLinkTag(html, rel, href) {
  const regex = new RegExp(`<link[^>]*rel="${escapeRegExp(rel)}"[^>]*>`, 'i');
  const tag = `<link rel="${rel}" href="${href}" />`;
  if (regex.test(html)) {
    return html.replace(regex, tag);
  }
  return insertBeforeHeadClose(html, tag);
}

/**
 * @returns {import('vite').Plugin}
 */
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

      // Generate Route Pages
      for (const route of ROUTES) {
        let html = baseHtml;
        const seo = getSEOForRoute(route);

        html = replaceTitle(html, seo.title);
        html = replaceMetaTag(html, 'name', 'description', seo.description);
        html = replaceMetaTag(html, 'name', 'keywords', seo.keywords || '');
        html = replaceMetaTag(html, 'name', 'author', seo.author);
        html = replaceMetaTag(html, 'name', 'robots', seo.robots || 'index, follow');
        html = replaceMetaTag(html, 'name', 'theme-color', seo.themeColor || '#000000');
        html = replaceMetaTag(html, 'name', 'last-modified', seo.lastModified);
        html = replaceLinkTag(html, 'canonical', seo.canonicalUrl);

        html = replaceMetaTag(html, 'property', 'og:type', seo.ogType);
        html = replaceMetaTag(html, 'property', 'og:title', seo.ogTitle);
        html = replaceMetaTag(html, 'property', 'og:description', seo.ogDescription);
        html = replaceMetaTag(html, 'property', 'og:url', seo.ogUrl);
        html = replaceMetaTag(html, 'property', 'og:site_name', seo.ogSiteName);
        html = replaceMetaTag(html, 'property', 'og:image', seo.ogImage);
        html = replaceMetaTag(html, 'property', 'og:image:width', '1200');
        html = replaceMetaTag(html, 'property', 'og:image:height', '630');

        html = replaceMetaTag(html, 'name', 'twitter:card', seo.twitterCard);
        html = replaceMetaTag(html, 'name', 'twitter:title', seo.twitterTitle);
        html = replaceMetaTag(html, 'name', 'twitter:description', seo.twitterDescription);
        html = replaceMetaTag(html, 'name', 'twitter:image', seo.twitterImage);

        const routeDir = route === '/' ? distDir : path.join(distDir, route.slice(1));
        fs.mkdirSync(routeDir, { recursive: true });
        fs.writeFileSync(path.join(routeDir, 'index.html'), html, 'utf-8');

        const routeLabel = route === '/' ? '/' : route;
        console.log(`[SEO Prerender] Generated ${routeLabel}index.html`);
      }

      // Generate sitemap.xml
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${ROUTES.map(route => `
  <url>
    <loc>https://editandkraft.in${route === '/' ? '' : route}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
</urlset>`;
      fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap, 'utf-8');
      console.log('[SEO Prerender] Generated sitemap.xml');

      // Generate robots.txt
      const robots = `User-agent: *
Allow: /
Disallow: /admin/

Sitemap: https://editandkraft.in/sitemap.xml`;
      fs.writeFileSync(path.join(distDir, 'robots.txt'), robots, 'utf-8');
      console.log('[SEO Prerender] Generated robots.txt');

      console.log(`[SEO Prerender] ✓ ${ROUTES.length} route pages generated.`);
    },
  };
}
