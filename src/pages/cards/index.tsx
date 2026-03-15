import React, { useState, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import ArchiveFilterListBox from "@/components/ArchiveFilterListBox/ArchiveFilterListBox";
import GridCards from "@/components/GridCards";
import { FILTERS_OPTIONS } from "@/contains/contants";
import ModalRarity from "@/components/ModalTaxonomy/ModalTaxonomy";

const GET_CARDS = gql`
  query getCards($first: Int = 10, $after: String) {
    cards(first: $first, after: $after) {
      nodes {
        title
        slug
        cardsFields {
          image {
            node { sourceUrl mediaDetails { file height width } slug }
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
      pageInfo { endCursor hasNextPage }
    }
  }
`;

const CardsPage = () => {
  const { loading, error, data } = useQuery(GET_CARDS, { variables: { first: 50 } });

  const [selectedFilter, setSelectedFilter] = useState(FILTERS_OPTIONS[0]);
  const [isRarityModalOpen, setRarityModalOpen] = useState(false);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);

  // ✅ Hooks toujours appelés au même niveau
  const cards = data?.cards?.nodes || [];

  const allRarities = useMemo(
    () =>
      Array.from(
        new Set(
          cards.flatMap(c => c.rarities?.nodes?.map(r => r.name || "")).filter(Boolean)
        )
      ),
    [cards]
  );

  const filteredCards = useMemo(() => {
    if (!selectedRarity) return cards;
    return cards.filter(c => c.rarities?.nodes?.some(r => r.name === selectedRarity));
  }, [cards, selectedRarity]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! {error.message}</p>;

  return (
    <div className="container pt-10 pb-16">
      <div className="flex justify-between items-center mb-6">
        <ArchiveFilterListBox
          lists={FILTERS_OPTIONS}
          defaultValue={selectedFilter}
          onChange={setSelectedFilter}
          onOpenRarityModal={() => setRarityModalOpen(true)}
        />
      </div>

      <GridCards cards={filteredCards} loading={loading} showLoadmore={false} />

      <ModalRarity
        isOpen={isRarityModalOpen}
        onClose={() => setRarityModalOpen(false)}
        rarities={allRarities}
        onSelect={setSelectedRarity}
      />
    </div>
  );
};

export default CardsPage;
