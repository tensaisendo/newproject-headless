import ArchiveFilterListBox from "@/components/ArchiveFilterListBox/ArchiveFilterListBox";
import { FILTERS_OPTIONS } from "@/contains/contants";
import { gql, useQuery } from "@apollo/client";
import dynamic from "next/dynamic";
import { FC } from "react";
import GridCards from "@/components/GridCards";

const DynamicModalCategories = dynamic(
  () => import("@/components/ModalCategories")
);
const DynamicModalTags = dynamic(() => import("@/components/ModalTags"));

const GET_CARDS = gql`
  query getCards($first: Int = 10, $after: String) {
    cards(first: $first, after: $after) {
      nodes {
        title
        slug
        cardsFields {
          image {
            node {
              sourceUrl
              mediaDetails { file height width }
              slug
            }
          }
          attribute
          counter
          effect
          life
          power
          price
        }
        colors { nodes { name slug } }
        features { nodes { name } }
        rarities { nodes { name slug } }
        sets { nodes { name } }
        typesOfCard { nodes { name slug } }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

interface ICardsLayoutProps {
  children: React.ReactNode;
  name?: string | null;
}

const CardsLayout: FC<ICardsLayoutProps> = ({ children }) => {
  const { loading, error, data, fetchMore } = useQuery(GET_CARDS, {
    variables: { first: 10 }, // 10 cartes par page
  });

  if (loading && !data) return <p>Loading...</p>;
  if (error) return <p>Error! {error.message}</p>;

  const cards = data.cards.nodes;

  const handleLoadMore = () => {
    if (!data.cards.pageInfo.hasNextPage) return;

    fetchMore({
      variables: { after: data.cards.pageInfo.endCursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          cards: {
            __typename: prev.cards.__typename,
            nodes: [...prev.cards.nodes, ...fetchMoreResult.cards.nodes],
            pageInfo: fetchMoreResult.cards.pageInfo,
          },
        };
      },
    });
  };

  return (
    <div className="">
      <div className="ncmazfc-page-category">
        {children}

        <div className="container pt-10 pb-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
          <div>
            <div className="flex flex-col md:justify-between md:flex-row">
              <div className="flex space-x-2.5 rtl:space-x-reverse">
                <DynamicModalCategories />
                <DynamicModalTags />
              </div>
              <div className="block my-4 border-b w-full border-neutral-300 dark:border-neutral-500 md:hidden" />
              <div className="flex justify-end">
                <ArchiveFilterListBox
                  onChange={() => {}}
                  lists={FILTERS_OPTIONS}
                />
              </div>
            </div>

            <GridCards
              cards={cards}
              loading={loading}
              showLoadmore={!!data.cards.pageInfo.hasNextPage}
              onClickLoadmore={handleLoadMore}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardsLayout;
