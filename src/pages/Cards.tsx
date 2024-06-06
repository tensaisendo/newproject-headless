import { gql, useQuery } from "@apollo/client";
import PageLayout from "../container/PageLayout";

const GET_CARDS = gql`
  query getCards {
    cards {
      nodes {
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
  }
`;

const Cards = () => {
  const { loading, error, data } = useQuery(GET_CARDS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! {error.message}</p>;

  return (
    <PageLayout>
      <h1>Card List</h1>
      <ul>
        {data.cards.nodes.map((card: any) => (
          <li key={card.slug}>
            <h2>{card.title}</h2>          
            {card.cardsFields.image && (
              <img
                src={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-content/uploads/${card.cardsFields.image.node.mediaDetails.file}`}
                alt={card.cardsFields.image.node.slug}
                height={card.cardsFields.image.node.mediaDetails.height}
                width={card.cardsFields.image.node.mediaDetails.width}
              />
            )}
          </li>
        ))}
      </ul>
    </PageLayout>
  );
};

export default Cards;