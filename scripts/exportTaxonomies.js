// scripts/exportTaxonomies.js
// Va générer un Json de toutes les Taxonomies créés (idéal pour passer de Local à Prod)

const fs = require("fs");
const path = require("path");
const fetch = require("cross-fetch");
//require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const { WORDPRESS_URL, WP_USER, WP_APP_PASSWORD } = process.env;
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString("base64");

const taxonomies = ["color", "rarity", "feature", "set", "typeofcard"];

async function fetchTaxo(slug) {
  const res = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/${slug}?per_page=100`, {
    headers: { Authorization: AUTH },
  });
  const data = await res.json();
  return data.map(t => ({ name: t.name, slug: t.slug }));
}

async function main() {
  const exportData = {};
  for (const taxo of taxonomies) {
    exportData[taxo] = await fetchTaxo(taxo);
  }
  const outPath = path.join(__dirname, "../data/taxonomies-export.json");
  fs.writeFileSync(outPath, JSON.stringify(exportData, null, 2), "utf-8");
  console.log(`✅ Export terminé : ${outPath}`);
}

main().catch(console.error);
