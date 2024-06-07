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
  const { title, image, type } = card;

  const renderContent = () => {
    // IMAGE
    return (
      <MyImage
        alt={title || "Card Image"}
        fill
        className="object-cover"
        src={image?.node?.mediaDetails.file || ""}
        sizes="(max-width: 600px) 480px, 800px"
      />
    );
  };

  return (
    <div className={`nc-PostFeaturedMedia relative ${className}`}>
      {renderContent()}
    </div>
  );
};

export default CardFeaturedMedia;
