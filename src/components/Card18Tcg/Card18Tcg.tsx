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
      attribute?: string;
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

  return (
    <div
      className={`nc-Card11 relative flex flex-col group rounded-3xl overflow-hidden bg-white dark:bg-neutral-900 ${className}`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div className={`block flex-shrink-0 relative w-full rounded-t-3xl overflow-hidden z-10 ${ratio}`}>
        <div>
          <CardFeaturedMedia card={card} isHover={isHover} />
        </div>
      </div>

      <Link href={`/cards/${card.slug}`} className="absolute inset-0"></Link>
      
      {showTitle && (
        <div className="flex-1 rounded-b-3xl py-4 px-3.5 flex flex-col space-y-3 border border-neutral-100 dark:border-neutral-800 border-t-0">
          <h3 className="nc-card-title block text-base font-semibold text-neutral-900 dark:text-neutral-100">
            {card.title}
          </h3>
      </div>)}
    </div>
  );
};

export default Card18Tcg;
