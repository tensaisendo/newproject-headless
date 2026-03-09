const fs = require("fs");
const path = require("path");
const fetch = require("cross-fetch");
const { GraphQLClient, gql } = require("graphql-request");
require("dotenv").config({ path: ".env.local" });

const { WORDPRESS_URL, WP_USER, WP_APP_PASSWORD } = process.env;

if (!WORDPRESS_URL || !WP_USER || !WP_APP_PASSWORD) {
  throw new Error("❌ Variables .env manquantes");
}

const GRAPHQL_URL = `${WORDPRESS_URL}/graphql`;
const REST_POST_URL = `${WORDPRESS_URL}/wp-json/wp/v2/card`;
const MEDIA_URL = `${WORDPRESS_URL}/wp-json/wp/v2/media`;

const AUTH =
  "Basic " +
  Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString("base64");

const client = new GraphQLClient(GRAPHQL_URL, {
  headers: {
    Authorization: AUTH,
  },
});

/* ===========================
   Upload Media
=========================== */
async function uploadMedia(filePath) {
  const fileName = path.basename(filePath);
  const file = fs.readFileSync(filePath);

  const res = await fetch(MEDIA_URL, {
    method: "POST",
    headers: {
      Authorization: AUTH,
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Type": "image/jpeg",
    },
    body: file,
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  const data = await res.json();
  return data.id;
}

/* ===========================
   Create Card (GraphQL)
=========================== */
async function createCard(title, slug) {
  const mutation = gql`
    mutation CreateCard($title: String!, $slug: String!) {
      createCard(
        input: {
          title: $title
          slug: $slug
          status: PUBLISH
        }
      ) {
        card {
          databaseId
        }
      }
    }
  `;

  const res = await client.request(mutation, { title, slug });
  return res.createCard.card.databaseId;
}

/* ===========================
   Update ACF via REST
=========================== */
async function updateAcfFields(postId, imageId) {
  const res = await fetch(`${REST_POST_URL}/${postId}`, {
    method: "POST",
    headers: {
      Authorization: AUTH,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      acf: {
        image: imageId,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return await res.json();
}

/* ===========================
   MAIN IMPORT
=========================== */
async function main() {
  const dir = path.join(process.cwd(), "images/cards");

  if (!fs.existsSync(dir)) {
    throw new Error("❌ Dossier images/cards introuvable");
  }

  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));

  console.log(`📦 ${files.length} images trouvées`);

  for (const file of files) {
    const slug = path.parse(file).name;
    const filePath = path.join(dir, file);

    try {
      console.log(`🔎 Import ${slug}`);

      const mediaId = await uploadMedia(filePath);
      console.log("   🖼 Media uploaded:", mediaId);

      const postId = await createCard(slug, slug);
      console.log("   📝 Card created:", postId);

      await updateAcfFields(postId, mediaId);
      console.log("   🔗 ACF updated");

      console.log(`✅ Terminé: ${slug}\n`);
    } catch (err) {
      console.error(`❌ Erreur ${slug}:`, err.message, "\n");
    }
  }

  console.log("🎉 Import terminé");
}

main();