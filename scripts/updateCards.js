const fs = require("fs");
const path = require("path");
const { GraphQLClient, gql } = require("graphql-request");
require("dotenv").config({ path: ".env.local" });

const { WORDPRESS_URL, WP_USER, WP_APP_PASSWORD } = process.env;

if (!WORDPRESS_URL || !WP_USER || !WP_APP_PASSWORD) {
  throw new Error("❌ Variables .env manquantes");
}

const GRAPHQL_URL = `${WORDPRESS_URL}/graphql`;

const AUTH =
  "Basic " + Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString("base64");

const client = new GraphQLClient(GRAPHQL_URL, {
  headers: {
    Authorization: AUTH,
  },
});

const cards = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/cards.json"))
);

function formatACF(fields) {
  const acf = {};

  for (const [key, value] of Object.entries(fields || {})) {
    acf[key] =
      value === undefined || value === null || value === ""
        ? null
        : String(value);
  }

  return acf;
}

async function loadTaxonomies() {
  const query = gql`
    query Taxonomies {
      colors(first: 100) {
        nodes {
          databaseId
          name
        }
      }
      features(first: 100) {
        nodes {
          databaseId
          name
        }
      }
      rarities(first: 100) {
        nodes {
          databaseId
          name
        }
      }
      sets(first: 100) {
        nodes {
          databaseId
          name
        }
      }
      typesOfCard(first: 100) {
        nodes {
          databaseId
          name
        }
      }
    }
  `;

  const data = await client.request(query);

  const maps = {};

  for (const [taxonomy, value] of Object.entries(data)) {
    maps[taxonomy] = {};

    value.nodes.forEach((term) => {
      maps[taxonomy][term.name.toLowerCase()] = term.databaseId;
    });
  }

  return maps;
}

async function loadCards() {
  const query = gql`
    query Cards {
      cards(first: 10) {
        nodes {
          databaseId
          slug
        }
      }
    }
  `;

  const data = await client.request(query);

  const map = {};

  data.cards.nodes.forEach((card) => {
    map[card.slug.toLowerCase()] = card.databaseId;
  });

  return map;
}

async function updateCard(id, card, taxonomyMaps) {
  const acf = formatACF(card.cardsFields);

  const taxInput = {};

  if (card.taxonomies) {
    for (const [tax, values] of Object.entries(card.taxonomies)) {
      const map = taxonomyMaps[tax];
      if (!map) continue;

      taxInput[tax] = {
        set: values
          .map((v) => map[v.toLowerCase()])
          .filter(Boolean),
      };
    }
  }

  const mutation = gql`
    mutation UpdateCard(
      $id: ID!
      $acf: Card_Cardsfields_Input
      $colors: CardToColorConnectionInput
      $features: CardToFeatureConnectionInput
      $rarities: CardToRarityConnectionInput
      $sets: CardToSetConnectionInput
      $typesOfCard: CardToTypesOfCardConnectionInput
    ) {
      updateCard(
        input: {
          id: $id
          cardsFields: $acf
          colors: $colors
          features: $features
          rarities: $rarities
          sets: $sets
          typesOfCard: $typesOfCard
        }
      ) {
        card {
          databaseId
        }
      }
    }
  `;

  const variables = {
    id,
    acf,
    colors: taxInput.colors,
    features: taxInput.features,
    rarities: taxInput.rarities,
    sets: taxInput.sets,
    typesOfCard: taxInput.typesOfCard,
  };

  await client.request(mutation, variables);
}

async function main() {
  console.log(`📦 ${cards.length} cards à mettre à jour`);

  console.log("🔎 Chargement des cards...");
  const cardMap = await loadCards();

  console.log("🔎 Chargement des taxonomies...");
  const taxonomyMaps = await loadTaxonomies();

  for (const card of cards) {
    const slug = card.slug.toLowerCase();

    console.log(`\n🔎 ${card.slug}`);

    const id = cardMap[slug];

    if (!id) {
      console.log(`⚠️ Card inexistante : ${card.slug}`);
      continue;
    }

    try {
      await updateCard(id, card, taxonomyMaps);
      console.log(`✅ Updated ${card.slug}`);
    } catch (err) {
      console.error(`❌ Erreur update ${card.slug}`, err.message);
    }
  }

  console.log("\n🎉 Update terminé");
}

main();