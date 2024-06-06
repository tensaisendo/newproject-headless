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
    <Layout>
      <h1>Card List</h1>
      <ul>
        {data.cards.nodes.map((card: any) => (
          <li key={card.slug}>
            <h2>{card.title}</h2>
            <p>Slug: {card.slug}</p>
            <p>Card Title: {card.cardsFields.cardTitle}</p>
            <p>Color: {card.cardsFields.color.join(", ")}</p>
            <p>Counter: {card.cardsFields.counter}</p>
            <p>Effect: {card.cardsFields.effect}</p>
            <p>Life: {card.cardsFields.life}</p>
            <p>Power: {card.cardsFields.power}</p>
            <p>Rarity: {card.cardsFields.rarity.join(", ")}</p>
            <p>Type: {card.cardsFields.type.join(", ")}</p>
            {card.cardsFields.image && (
              <img
                src={card.cardsFields.image.node.mediaDetails.file}
                alt={card.cardsFields.image.node.slug}
                height={card.cardsFields.image.node.mediaDetails.height}
                width={card.cardsFields.image.node.mediaDetails.width}
              />
            )}
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Cards;