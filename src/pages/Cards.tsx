// import { gql, useQuery } from "@apollo/client";
// import PageLayout from "../container/PageLayout";

// const GET_CARDS = gql`
//   query getCards {
//     cards {
//       nodes {
//         title
//         slug
//         cardsFields {
//           cardTitle
//           color
//           counter
//           effect
//           life
//           power
//           rarity
//           type
//           image {
//             node {
//               mediaDetails {
//                 file
//                 height
//                 width
//               }
//               slug
//             }
//           }
//         }
//       }
//     }
//   }
// `;

// const Cards = () => {
//   const { loading, error, data } = useQuery(GET_CARDS);

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error! {error.message}</p>;

//   return (
//     <PageLayout>
//       <h1>Card List</h1>
//       <ul>
//         {data.cards.nodes.map((card: any) => (
//           <li key={card.slug}>
//             <h2>{card.title}</h2>
//             <p>Slug: {card.slug}</p>
//             <p>Card Title: {card.cardsFields.cardTitle}</p>
//             <p>Color: {card.cardsFields.color.join(", ")}</p>
//             <p>Counter: {card.cardsFields.counter}</p>
//             <p>Effect: {card.cardsFields.effect}</p>
//             <p>Life: {card.cardsFields.life}</p>
//             <p>Power: {card.cardsFields.power}</p>
//             <p>Rarity: {card.cardsFields.rarity.join(", ")}</p>
//             <p>Type: {card.cardsFields.type.join(", ")}</p>
//             {card.cardsFields.image && (
//               <img
//                 src={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-content/uploads/${card.cardsFields.image.node.mediaDetails.file}`}
//                 alt={card.cardsFields.image.node.slug}
//                 height={card.cardsFields.image.node.mediaDetails.height}
//                 width={card.cardsFields.image.node.mediaDetails.width}
//               />
//             )}
//           </li>
//         ))}
//       </ul>
//     </PageLayout>
//   );
// };

// export default Cards;

import React, { FC } from "react";
import NcImage from "@/components/NcImage/NcImage";
import { getPostDataFromPostFragment } from "@/utils/getPostDataFromPostFragment";
import SingleHeader from "../SingleHeader";
import { FragmentType } from "@/__generated__";
import { NC_POST_FULL_FRAGMENT } from "@/fragments";

export interface SingleType1Props {
  post: FragmentType<typeof NC_POST_FULL_FRAGMENT>;
  showRightSidebar?: boolean;
}

const SingleType1: FC<SingleType1Props> = ({ post, showRightSidebar }) => {
  //
  const {
    title,
    content,
    date,
    author,
    databaseId,
    excerpt,
    featuredImage,
    ncPostMetaData,
  } = getPostDataFromPostFragment(post || {});
  //
  const hasFeaturedImage = !!featuredImage?.sourceUrl;

  const imgWidth = featuredImage?.mediaDetails?.width || 1000;
  const imgHeight = featuredImage?.mediaDetails?.height || 750;
  return (
    <>
      <div className={`nc-PageSingle pt-8 lg:pt-16`}>
        <header className="container rounded-xl">
          <div
            className={
              !hasFeaturedImage && showRightSidebar
                ? ""
                : `max-w-screen-md mx-auto`
            }
          >
            <SingleHeader post={{ ...post }} />
            {!hasFeaturedImage && (
              <div className="my-5 border-b border-neutral-200 dark:border-neutral-800" />
            )}
          </div>
        </header>

        {/* FEATURED IMAGE */}
        {!!hasFeaturedImage && (
          <NcImage
            alt={title}
            containerClassName="container my-10 sm:my-12"
            className={`rounded-xl mx-auto ${
              imgWidth <= 768 && ncPostMetaData?.showRightSidebar
                ? "w-full max-w-screen-md"
                : ""
            }`}
            src={featuredImage?.sourceUrl || ""}
            width={imgWidth}
            height={imgHeight}
            sizes={"(max-width: 1024px) 100vw, 1280px"}
            priority
            enableDefaultPlaceholder
          />
        )}
      </div>
    </>
  );
};

export default SingleType1;
