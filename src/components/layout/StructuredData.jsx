// ============================================================
// STRUCTURED DATA COMPONENT (JSON-LD)
// ============================================================
// Injects schema.org structured data into <head> for each route.
// All schemas are dynamically generated from content.js data.
// When services, portfolio, or company info change → schemas adapt.
// ============================================================

import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { getAllSchemasForRoute } from "../../data/seo";

/**
 * StructuredData — Injects JSON-LD structured data per route.
 * Google uses this to create rich search results (rich snippets).
 */
export default function StructuredData() {
  const { pathname } = useLocation();
  const schemas = getAllSchemasForRoute(pathname);

  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
        >
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
