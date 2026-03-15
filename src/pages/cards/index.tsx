import React, { useState, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import ArchiveFilterListBox from "@/components/ArchiveFilterListBox/ArchiveFilterListBox";
import GridCards from "@/components/GridCards";
import ModalTaxonomy from "@/components/ModalTaxonomy/ModalTaxonomy";
import { FILTERS_OPTIONS } from "@/contains/contants";

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
  const { loading, error, data, fetchMore } = useQuery(GET_CARDS, { variables: { first: 20 } });

  const cards = data?.cards?.nodes || [];

  // States pour les filtres
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [priceSort, setPriceSort] = useState<"asc" | "desc" | null>(null);

  // States pour modals
  const [isRarityModalOpen, setRarityModalOpen] = useState(false);
  const [isColorModalOpen, setColorModalOpen] = useState(false);
  const [isFeatureModalOpen, setFeatureModalOpen] = useState(false);
  const [isSetModalOpen, setSetModalOpen] = useState(false);

  // Récupérer toutes les valeurs uniques pour chaque taxonomy
  const allRarities = useMemo(
    () => Array.from(new Set(cards.flatMap(c => c.rarities?.nodes?.map(r => r.name || "")).filter(Boolean))),
    [cards]
  );
  const allColors = useMemo(
    () => Array.from(new Set(cards.flatMap(c => c.colors?.nodes?.map(c => c.name || "")).filter(Boolean))),
    [cards]
  );
  const allFeatures = useMemo(
    () => Array.from(new Set(cards.flatMap(c => c.features?.nodes?.map(f => f.name || "")).filter(Boolean))),
    [cards]
  );
  const allSets = useMemo(
    () => Array.from(new Set(cards.flatMap(c => c.sets?.nodes?.map(s => s.name || "")).filter(Boolean))),
    [cards]
  );

  // Filtrage
  const filteredCards = useMemo(() => {
    return cards
      .filter(c => !selectedRarity || c.rarities?.nodes.some(r => r.name === selectedRarity))
      .filter(c => !selectedColor || c.colors?.nodes.some(r => r.name === selectedColor))
      .filter(c => !selectedFeature || c.features?.nodes.some(f => f.name === selectedFeature))
      .filter(c => !selectedSet || c.sets?.nodes.some(s => s.name === selectedSet))
      .sort((a, b) => {
        if (!priceSort) return 0;
        const priceA = Number(a.cardsFields.price) || 0;
        const priceB = Number(b.cardsFields.price) || 0;
        return priceSort === "asc" ? priceA - priceB : priceB - priceA;
      });
  }, [cards, selectedRarity, selectedColor, selectedFeature, selectedSet, priceSort]);

  const handleLoadMore = () => {
    if (!data?.cards?.pageInfo?.hasNextPage) return;

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! {error.message}</p>;

  return (
    <div className="container pt-10 pb-16">
      <div className="flex flex-wrap gap-2 mb-6">
        <ArchiveFilterListBox lists={[{ name: "Price Low → High", value: "price_asc" }, { name: "Price High → Low", value: "price_desc" }]} onChange={item => setPriceSort(item.value === "price_asc" ? "asc" : "desc")} />
        <ArchiveFilterListBox lists={[{ name: "Rarity", value: "rarity" }]} onOpenRarityModal={() => setRarityModalOpen(true)} />
        <ArchiveFilterListBox lists={[{ name: "Color", value: "color" }]} onOpenRarityModal={() => setColorModalOpen(true)} />
        <ArchiveFilterListBox lists={[{ name: "Feature", value: "feature" }]} onOpenRarityModal={() => setFeatureModalOpen(true)} />
        <ArchiveFilterListBox lists={[{ name: "Set", value: "set" }]} onOpenRarityModal={() => setSetModalOpen(true)} />
      </div>

      <GridCards cards={filteredCards} loading={loading} showLoadmore={!!data.cards.pageInfo.hasNextPage} onClickLoadmore={handleLoadMore} />

      {/* Modals */}
      <ModalTaxonomy isOpen={isRarityModalOpen} onClose={() => setRarityModalOpen(false)} items={allRarities} onSelect={setSelectedRarity} title="Select Rarity" />
      <ModalTaxonomy isOpen={isColorModalOpen} onClose={() => setColorModalOpen(false)} items={allColors} onSelect={setSelectedColor} title="Select Color" />
      <ModalTaxonomy isOpen={isFeatureModalOpen} onClose={() => setFeatureModalOpen(false)} items={allFeatures} onSelect={setSelectedFeature} title="Select Feature" />
      <ModalTaxonomy isOpen={isSetModalOpen} onClose={() => setSetModalOpen(false)} items={allSets} onSelect={setSelectedSet} title="Select Set" />
    </div>
  );
};

export default CardsPage;