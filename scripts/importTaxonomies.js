// scripts/importTaxonomies.js
const fs = require("fs");
const path = require("path");
const fetch = require("cross-fetch");
// require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const { WORDPRESS_URL, WP_USER, WP_APP_PASSWORD } = process.env;
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString("base64");

const jsonPath = path.join(__dirname, "../data/taxonomies-export.json");
const taxonomies = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

async function createTerm(taxoSlug, term) {
  const res = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/${taxoSlug}`, {
    method: "POST",
    headers: {
      Authorization: AUTH,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(term),
  });
  if (!res.ok) {
    console.error(`❌ Erreur création ${term.name} dans ${taxoSlug}:`, await res.text());
  } else {
    console.log(`✅ Créé : ${taxoSlug} -> ${term.name}`);
  }
}

async function main() {
  for (const [taxoSlug, terms] of Object.entries(taxonomies)) {
    for (const term of terms) {
      await createTerm(taxoSlug, term);
    }
  }
  console.log("🎉 Import des taxonomies terminé !");
}

main().catch(console.error);
