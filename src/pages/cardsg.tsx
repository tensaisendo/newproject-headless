import ArchiveFilterListBox from "@/components/ArchiveFilterListBox/ArchiveFilterListBox";
import { FILTERS_OPTIONS } from "@/contains/contants";
import { NC_SITE_SETTINGS } from "@/contains/site-settings";
import { gql, useQuery } from '@apollo/client';
import dynamic from "next/dynamic";
import { FC } from "react";
import GridCards from "@/components/GridCards";

const DynamicModalCategories = dynamic(
  () => import("@/components/ModalCategories")
);
const DynamicModalTags = dynamic(() => import("@/components/ModalTags"));

const GET_CARDS = gql`
  query getCards {
    cards {
      nodes {
        title
        slug
        cardsFields {
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

interface ICardsLayoutProps {
  children: React.ReactNode;
  name?: string | null;
}

const CardsLayout: FC<ICardsLayoutProps> = ({ children, name}) => {
  // START ----------
  //
  const { loading, error, data } = useQuery(GET_CARDS);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! {error.message}</p>
  
  //

  const cards = data.cards.nodes;

  return (
    <div className="">
      <div className={`ncmazfc-page-category`}>
        {/* HEADER */}
        {children}
        {/* ====================== END HEADER ====================== */}

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
              showLoadmore={false}
              onClickLoadmore={() => {}}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CardsLayout;
