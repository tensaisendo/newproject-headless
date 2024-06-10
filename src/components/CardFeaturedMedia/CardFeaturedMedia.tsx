import React, { FC } from "react";
import { CardDataFragmentType } from "@/data/types";
import MyImage from "../MyImage";

export interface CardFeaturedMediaProps {
  className?: string;
  card: CardDataFragmentType;
  isHover?: boolean;
}

const CardFeaturedMedia: FC<CardFeaturedMediaProps> = ({
  className = "w-full h-full",
  card,
  isHover = false,
}) => {

  const renderContent = () => {
    // IMAGE
    // Vérifiez si card.cardsFields.image est défini avant d'accéder à la propriété image.node
    if (card.cardsFields && card.cardsFields.image) {
    
      return (
        <MyImage
          alt={title || "Card Image"}
          fill
          className="object-cover"
          src={card.cardsFields.image.node?.mediaDetails?.file || ""}
          sizes="(max-width: 600px) 480px, 800px"
        />
      );

    } else {
      // Gérer le cas où l'image est null ou undefined
      return <div>Aucune image disponible</div>;
    }
    
  };

  return (
    <div className={`nc-PostFeaturedMedia relative ${className}`}>
      {renderContent()}
    </div>
  );
};

export default CardFeaturedMedia;
