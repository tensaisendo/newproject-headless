import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { gql, useQuery } from '@apollo/client';
import client from '@/lib/apolloClient';
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
  const { data } = await client.query({
    query: gql`
      query GetAllCards {
        cards {
          nodes {
            slug
          }
        }
      }
    `
  });

  const paths = data.cards.nodes.map((card: { slug: string }) => ({
    params: { slug: card.slug },
  }));

  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };

  const { data } = await client.query({
    query: GET_CARD_BY_SLUG,
    variables: { slug },
  });

  if (!data.cardBy) {
    return { notFound: true };
  }

  return {
    props: {
      card: data.cardBy,
    },
    revalidate: 10, // seconds to revalidate
  };
};

export default CardPage;
