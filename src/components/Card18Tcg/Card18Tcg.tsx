import React, { FC, useState } from "react";
import Link from "next/link";
import CardFeaturedMedia from "@/components/CardFeaturedMedia/CardFeaturedMedia";


interface Card18TcgProps {
  card: {
    title: string;
    slug: string;
    cardsFields: {
      cardTitle: string;
      image?: {
        node: {
          mediaDetails: {
            file: string;
            height: number;
            width: number;
          };
          slug: string;
          sourceUrl: string;
        };
      };
      attribute?: (string | null)[];
      counter: string;
      effect?: string;
      life: number;
      power?: string;
      price: string;
    };
    colors?: { nodes: { name: string; slug: string }[] };
    features?: { nodes: { name: string }[] };
    rarities?: { nodes: { name: string; slug: string }[] };
    sets?: { nodes: { name: string }[] };
    typesOfCard?: { nodes: { name: string; slug: string }[] };
  };
  className?: string;
  ratio?: string;
  showTitle?: boolean;
}

const Card18Tcg: FC<Card18TcgProps> = ({
  className = "h-full",
  card,
  ratio = "aspect-w-4 aspect-h-3",
  showTitle = true,
}) => {
  const [isHover, setIsHover] = useState(false);

  const price =
    card.cardsFields?.price && Number(card.cardsFields.price) > 0
      ? card.cardsFields.price
      : null;

  const rarity = card.rarities?.nodes?.[0]?.name || null;


  return (
    <Link
      href={`/cards/${card.slug}`}
      className={`group nc-Card11 relative flex flex-col rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 transform transition-all duration-300 hover:scale-105 ${className}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className="relative w-full rounded-t-3xl overflow-hidden">
        {/* Image en arrière-plan */}
        {card.cardsFields.image?.node?.sourceUrl ? (
          <img
            src={card.cardsFields.image.node.sourceUrl}
            alt={card.cardsFields.cardTitle}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
            Image manquante
          </div>
        )}

        {/* Badge rareté */}
        {rarity && (
          <span className="absolute top-2 left-2 z-10 bg-yellow-400/70 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
            {rarity}
          </span>
        )}

        {/* Badge prix */}
        {price ? (
          <span className="absolute bottom-2 right-2 z-10 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
            {price} €
          </span>
        ) : (
          <span className="absolute bottom-2 right-2 z-10 bg-gray-300/80 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-md">
            N/A
          </span>
        )}
      </div>

      {/* Titre */}
      {showTitle && (
        <div className="flex-1 rounded-b-3xl py-4 px-3.5 flex flex-col space-y-3 border border-neutral-100 dark:border-neutral-800 border-t-0 bg-white dark:bg-neutral-900">
          <h3 className="nc-card-title block text-base font-semibold text-neutral-900 dark:text-neutral-100">
            {card.title}
          </h3>
        </div>
      )}
    </Link>
  );
};

export default Card18Tcg;
