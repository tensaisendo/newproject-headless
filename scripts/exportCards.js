// scripts/exportCards.js
// Va générer un Json de toutes les Cartes créés (idéal pour passer de Local à Prod)
const fs = require("fs");
const path = require("path");
const { GraphQLClient, gql } = require("graphql-request");
// require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const { WORDPRESS_URL, WP_USER, WP_APP_PASSWORD } = process.env;

if (!WORDPRESS_URL || !WP_USER || !WP_APP_PASSWORD) {
  throw new Error("❌ Variables .env manquantes");
}

const GRAPHQL_URL = `${WORDPRESS_URL}/graphql`;
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString("base64");

const client = new GraphQLClient(GRAPHQL_URL, {
  headers: { Authorization: AUTH },
});

// GraphQL pour récupérer toutes les Cards
const queryAllCards = gql`
  query CardsPaginated($after: String) {
    cards(first: 50, after: $after, where: { status: PUBLISH }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        slug
        title
        cardsFields {
          cardTitle
          image {
            node {
              sourceUrl
            }
          }
          attribute
          counter
          effect
          life
          power
          price
        }
        colors {
          nodes { name }
        }
        features {
          nodes { name }
        }
        rarities {
          nodes { name }
        }
        sets {
          nodes { name }
        }
        typesOfCard {
          nodes { name }
        }
      }
    }
  }
`;

async function fetchAllCards() {
  const allCards = [];
  let after = null;

  do {
    const res = await client.request(queryAllCards, { after });
    allCards.push(...res.cards.nodes);
    after = res.cards.pageInfo.hasNextPage ? res.cards.pageInfo.endCursor : null;
  } while (after);

  return allCards;
}

async function main() {
  const cards = await fetchAllCards();
  const outPath = path.join(__dirname, "../data/cards-export.json");

  fs.writeFileSync(outPath, JSON.stringify(cards, null, 2), "utf-8");
  console.log(`✅ Export terminé, ${cards.length} cartes sauvegardées dans ${outPath}`);
}

main().catch(console.error);
