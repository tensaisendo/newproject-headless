import React, { FC } from "react";
import Empty from "./Empty";
import Card18TcgSkeleton from "./Card18Tcg/Card18TcgSkeleton";
import Card18Tcg from "./Card18Tcg/Card18Tcg";
import ButtonPrimary from "./Button/ButtonPrimary";
import getTrans from "@/utils/getTrans";

interface Card {
  title: string;
  slug: string;
  cardsFields: {
    image?: {
      node: {
        mediaDetails: {
          file: string;
          height: number;
          width: number;
        };
        slug: string;
      };
    };
  };
}

interface Props {
  cards: Card[] | null;
  className?: string;
  loading?: boolean;
  showLoadmore?: boolean;
  onClickLoadmore?: () => void;
}

const GridCards: FC<Props> = ({
  className = "",
  posts: currentCards,
  loading,
  onClickLoadmore,
  showLoadmore,
}) => {
  return (
    <div className={className}>
      {/* LOOP ITEMS */}
      {!currentCards?.length && !loading ? (
        <Empty />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-y-8 md:gap-x-7 mt-8 lg:mt-12">
          {!currentCards?.length && loading
            ? [1, 1, 1, 1, 1, 1, 1, 1].map((_, i) => <Card18TcgSkeleton key={i} />)
            : (currentCards || []).map((card) => (
                <Card18Tcg key={card.slug} card={card} />
              ))}
        </div>
      )}

      {/* PAGINATION */}
      {showLoadmore ? (
        <div className="mt-12 lg:mt-14 flex justify-center">
          <ButtonPrimary loading={loading} onClick={onClickLoadmore}>
            {getTrans()["Show me more"]}
          </ButtonPrimary>
        </div>
      ) : null}
    </div>
  );
};

export default GridCards;
