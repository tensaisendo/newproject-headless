// pages/cards/[slug].tsx

import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { gql } from '@apollo/client';
import { initializeApollo, addApolloState } from '@/lib/apolloClient';
import { CardDataFragmentType } from '@/data/types';

const GET_CARD_BY_SLUG = gql`
  query GetCardBySlug($slug: String!) {
    cardBy(slug: $slug) {
      title
      slug
      cardsFields {
        cardTitle
        color
        counter
        effect
        life
        power
        rarity
        type
        image {
          node {
            mediaDetails {
              file
              height
              width
            }
            slug
          }
        }
      }
    }
  }
`;

interface CardPageProps {
  card: CardDataFragmentType;
}

const CardPage: React.FC<CardPageProps> = ({ card }) => {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{card.title}</h1>
      {/* Ajoutez le contenu de la carte ici */}
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const client = initializeApollo();

  const { data } = await client.query({
    query: gql`
      query GetAllCards {
        cards {
          nodes {
            slug
          }
        }
      }
    `,
  });

  const paths = data.cards.nodes.map((card: { slug: string }) => ({
    params: { slug: card.slug },
  }));

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const client = initializeApollo();
  const { slug } = params as { slug: string };

  const { data } = await client.query({
    query: GET_CARD_BY_SLUG,
    variables: { slug },
  });

  if (!data.cardBy) {
    return { notFound: true };
  }

  return addApolloState(client, {
    props: {
      card: data.cardBy,
    },
    revalidate: 10,
  });
};

export default CardPage;
