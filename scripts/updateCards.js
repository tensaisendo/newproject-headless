// scripts/updateCards.js
const fs = require("fs");
const path = require("path");
const fetch = require("cross-fetch");
const { GraphQLClient, gql } = require("graphql-request");
// require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const { WORDPRESS_URL, WP_USER, WP_APP_PASSWORD } = process.env;

if (!WORDPRESS_URL || !WP_USER || !WP_APP_PASSWORD) {
  throw new Error("❌ Variables .env manquantes");
}

const GRAPHQL_URL = `${WORDPRESS_URL}/graphql`;
const REST_POST_URL = `${WORDPRESS_URL}/wp-json/wp/v2/card`;
const MEDIA_URL = `${WORDPRESS_URL}/wp-json/wp/v2/media`;

const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString("base64");

const client = new GraphQLClient(GRAPHQL_URL, { headers: { Authorization: AUTH } });

const DRY_RUN = false;
const cardsJsonPath = path.join(__dirname, "../data/cards.json");
const cards = JSON.parse(fs.readFileSync(cardsJsonPath));

/* -----------------------------
   GET MEDIA ID FROM URL
----------------------------- */
async function getMediaIdFromUrl(imageUrl) {
  if (!imageUrl) return null;
  const fileName = path.basename(imageUrl);
  const res = await fetch(`${MEDIA_URL}?search=${fileName}`, {
    headers: { Authorization: AUTH },
  });
  const data = await res.json();
  if (data.length > 0) return data[0].id;
  return null;
}

/* -----------------------------
   GET TAXONOMY MAP
   name (lowercase) -> id
----------------------------- */
async function getTaxonomyMap(slug) {
  try {
    const res = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/${slug}`, {
      headers: { Authorization: AUTH },
    });
    const data = await res.json();
    if (!Array.isArray(data)) return {};
    const map = {};
    data.forEach((term) => {
      map[term.name.toLowerCase()] = term.id;
    });
    return map;
  } catch (err) {
    console.error(`❌ Erreur récupération taxonomy "${slug}"`, err.message);
    return {};
  }
}

/* -----------------------------
   MAP JSON TAXONOMY NAMES -> REST IDs
   et log les features manquantes
----------------------------- */
function mapTaxonomies(jsonValues, map) {
  return jsonValues
    ? jsonValues.map((name) => map[name.toLowerCase()]).filter(Boolean)
    : [];
}

/* -----------------------------
   FETCH ALL CARDS VIA PAGINATION
----------------------------- */
async function fetchAllCards() {
  const allCards = [];
  let after = null;

  const query = gql`
    query CardsPaginated($after: String) {
      cards(first: 50, after: $after, where: { status: PUBLISH }) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          databaseId
          slug
        }
      }
    }
  `;

  do {
    const res = await client.request(query, { after });
    allCards.push(...res.cards.nodes);
    after = res.cards.pageInfo.hasNextPage ? res.cards.pageInfo.endCursor : null;
  } while (after);

  return allCards;
}

/* -----------------------------
   MAIN
----------------------------- */
async function main() {
  console.log(`📦 ${cards.length} cards à mettre à jour`);

  const allCards = await fetchAllCards();
  const cardMap = {};
  allCards.forEach((c) => { cardMap[c.slug.toLowerCase()] = c.databaseId; });

  // Récupérer toutes les taxonomies REST
  const colorsMap = await getTaxonomyMap("color");
  const raritiesMap = await getTaxonomyMap("rarity");
  const featuresMap = await getTaxonomyMap("feature");
  const setsMap = await getTaxonomyMap("set");
  const typesOfCardMap = await getTaxonomyMap("typeofcard");

  for (const card of cards) {
    const slugKey = card.slug.toLowerCase();
    console.log(`\n🔎 ${card.slug}`);

    const postId = cardMap[slugKey];
    if (!postId) {
      console.log(`⚠️ Card inexistante : ${card.slug}`);
      continue;
    }

    // Si image dans JSON, chercher l'ID
    let mediaId = null;
    if (card.image) {
      try {
        mediaId = await getMediaIdFromUrl(card.image);
        if (!mediaId) console.warn(`⚠️ Media non trouvé pour ${card.image}`);
      } catch (err) {
        console.error(`❌ Erreur recherche media : ${err.message}`);
      }
    }

    // Préparer le body REST
    const body = {
      title: card.title,
      acf: card.cardsFields || {},
      color: mapTaxonomies(card.taxonomies?.colors, colorsMap, card.slug, "Color"),
      rarity: mapTaxonomies(card.taxonomies?.rarities, raritiesMap, card.slug, "Rarity"),
      feature: mapTaxonomies(card.taxonomies?.features, featuresMap, card.slug, "Feature"),
      set: mapTaxonomies(card.taxonomies?.sets, setsMap, card.slug, "Set"),
      typeofcard: mapTaxonomies(card.taxonomies?.typesOfCard, typesOfCardMap, card.slug, "TypeOfCard"),
    };

    if (mediaId) {
      body.acf.image = mediaId;
    }

    if (DRY_RUN) {
      console.log("DRY RUN: update body", JSON.stringify(body, null, 2));
      continue;
    }

    try {
      const res = await fetch(`${REST_POST_URL}/${postId}`, {
        method: "POST",
        headers: {
          Authorization: AUTH,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error(await res.text());
      console.log(`✅ Updated ${card.slug}`);
    } catch (err) {
      console.error(`❌ Erreur update ${card.slug}:`, err.message);
    }
  }

  console.log("\n🎉 Update terminé");
}

main().catch((err) => console.error(err));