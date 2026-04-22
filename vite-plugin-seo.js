// ============================================================
// VITE PLUGIN: BUILD-TIME SEO ASSET GENERATION
// ============================================================
// Generates robots.txt and sitemap.xml at build time.
// Sitemap includes all routes with lastmod = build date.
// Every time you deploy, the sitemap signals freshness.
// ============================================================

const SITE_URL = "https://editandkraft.in";

const ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/work", priority: "0.8", changefreq: "weekly" },
  { path: "/services", priority: "0.9", changefreq: "monthly" },
  { path: "/about", priority: "0.7", changefreq: "monthly" },
  { path: "/contact", priority: "0.6", changefreq: "monthly" },
];

export default function viteSeoPlugin() {
  return {
    name: "vite-plugin-seo",
    generateBundle() {
      const buildDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

      // ---- robots.txt ----
      const robotsTxt = [
        "# Edit & Kraft — Auto-generated robots.txt",
        `# Generated: ${buildDate}`,
        "",
        "User-agent: *",
        "Allow: /",
        "",
        `Sitemap: ${SITE_URL}/sitemap.xml`,
        "",
        "# Crawl-delay suggestion (optional, respected by some bots)",
        "Crawl-delay: 1",
      ].join("\n");

      this.emitFile({
        type: "asset",
        fileName: "robots.txt",
        source: robotsTxt,
      });

      // ---- sitemap.xml ----
      const urlEntries = ROUTES.map(
        (route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${buildDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
      ).join("\n");

      const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

      this.emitFile({
        type: "asset",
        fileName: "sitemap.xml",
        source: sitemapXml,
      });

      console.log(`\n🔍 SEO Plugin: Generated robots.txt and sitemap.xml (lastmod: ${buildDate})\n`);
    }

  };
}
