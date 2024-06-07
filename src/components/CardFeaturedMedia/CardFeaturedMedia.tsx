import React, { FC } from "react";
import GallerySlider from "./GallerySlider";
import MediaVideo from "./MediaVideo";
import MediaAudio from "./MediaAudio";
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
    // VIDEO
    if (type === "video" && isHover) {
      return <MediaVideo isHover videoUrl={image?.node?.mediaDetails.file || ""} />;
    }

    // AUDIO
    if (type === "audio" && image?.node?.mediaDetails.file) {
      return <MediaAudio card={card} />;
    }

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
    <div className={`nc-CardFeaturedMedia relative ${className}`}>
      {renderContent()}
    </div>
  );
};

export default CardFeaturedMedia;
