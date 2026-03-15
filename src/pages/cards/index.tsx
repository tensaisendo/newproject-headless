"use client";

import React, { useState, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import GridCards from "@/components/GridCards";
import ArchiveFilterListBox from "@/components/ArchiveFilterListBox/ArchiveFilterListBox";
import ModalTaxonomy from "@/components/ModalTaxonomy/ModalTaxonomy";
import { FILTERS_OPTIONS } from "@/contains/contants";
import Button from "@/components/Button/Button";

const GET_CARDS = gql`
  query getCards($first: Int = 10, $after: String) {
    cards(first: $first, after: $after) {
      nodes {
        title
        slug
        cardsFields {
          price
          image {
            node { sourceUrl mediaDetails { file height width } }
          }
        }
        rarities { nodes { name slug } }
        colors { nodes { name slug } }
        features { nodes { name } }
        sets { nodes { name } }
      }
      pageInfo { endCursor hasNextPage }
    }
  }
`;

const CardsPage = () => {
  const { loading, error, data, fetchMore } = useQuery(GET_CARDS, { variables: { first: 10 } });
  const cards = data?.cards?.nodes || [];

  // Filtres
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [priceOrder, setPriceOrder] = useState<"ASC" | "DESC" | null>(null);

  // Modals
  const [rarityModalOpen, setRarityModalOpen] = useState(false);
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [setModalOpen, setSetModalOpen] = useState(false);

  // Valeurs uniques pour les modals
  const allRarities = useMemo(() => Array.from(new Set(cards.flatMap(c => c.rarities?.nodes.map(r => r.name) || []))), [cards]);
  const allColors = useMemo(() => Array.from(new Set(cards.flatMap(c => c.colors?.nodes.map(c => c.name) || []))), [cards]);
  const allFeatures = useMemo(() => Array.from(new Set(cards.flatMap(c => c.features?.nodes.map(f => f.name) || []))), [cards]);
  const allSets = useMemo(() => Array.from(new Set(cards.flatMap(c => c.sets?.nodes.map(s => s.name) || []))), [cards]);

  // Filtrage côté client
  const filteredCards = useMemo(() => {
    return cards
      .filter(c => !selectedRarity || c.rarities?.nodes.some(r => r.name === selectedRarity))
      .filter(c => !selectedColor || c.colors?.nodes.some(col => col.name === selectedColor))
      .filter(c => !selectedFeature || c.features?.nodes.some(f => f.name === selectedFeature))
      .filter(c => !selectedSet || c.sets?.nodes.some(s => s.name === selectedSet))
      .sort((a, b) => {
        if (!priceOrder) return 0;
        return priceOrder === "ASC"
          ? Number(a.cardsFields.price) - Number(b.cardsFields.price)
          : Number(b.cardsFields.price) - Number(a.cardsFields.price);
      });
  }, [cards, selectedRarity, selectedColor, selectedFeature, selectedSet, priceOrder]);

  if (loading && !cards.length) return <p>Loading...</p>;
  if (error) return <p>Error! {error.message}</p>;

  const handleLoadMore = () => {
    if (!data.cards.pageInfo.hasNextPage) return;
    fetchMore({ variables: { after: data.cards.pageInfo.endCursor } });
  };

  return (
    <div className="container pt-10 pb-16">
      {/* TRI / Price */}
      <div className="flex space-x-2 mb-4">
        <ArchiveFilterListBox
          lists={[
            { name: "Price Low → High", value: "ASC" },
            { name: "Price High → Low", value: "DESC" },
          ]}
          defaultValue={priceOrder ? { name: `Price ${priceOrder}`, value: priceOrder } : undefined}
          onChange={val => setPriceOrder(val.value as "ASC" | "DESC")}
        />
        {priceOrder && (
          <Button onClick={() => setPriceOrder(null)}>Reset Price</Button>
        )}
      </div>

      {/* Taxonomies */}
      <div className="flex space-x-2 mb-6">
        <Button onClick={() => selectedRarity ? setSelectedRarity(null) : setRarityModalOpen(true)}>
          {selectedRarity || "Rarity"} {selectedRarity ? "(Reset)" : ""}
        </Button>
        <Button onClick={() => selectedColor ? setSelectedColor(null) : setColorModalOpen(true)}>
          {selectedColor || "Color"} {selectedColor ? "(Reset)" : ""}
        </Button>
        <Button onClick={() => selectedFeature ? setSelectedFeature(null) : setFeatureModalOpen(true)}>
          {selectedFeature || "Feature"} {selectedFeature ? "(Reset)" : ""}
        </Button>
        <Button onClick={() => selectedSet ? setSelectedSet(null) : setSetModalOpen(true)}>
          {selectedSet || "Set"} {selectedSet ? "(Reset)" : ""}
        </Button>
      </div>

      <GridCards
        cards={filteredCards}
        loading={loading}
        showLoadmore={!!data.cards.pageInfo.hasNextPage}
        onClickLoadmore={handleLoadMore}
      />

      {/* Modals */}
      <ModalTaxonomy
        title="Rarity"
        isOpen={rarityModalOpen}
        onClose={() => setRarityModalOpen(false)}
        items={allRarities}
        onSelect={setSelectedRarity}
      />
      <ModalTaxonomy
        title="Color"
        isOpen={colorModalOpen}
        onClose={() => setColorModalOpen(false)}
        items={allColors}
        onSelect={setSelectedColor}
      />
      <ModalTaxonomy
        title="Feature"
        isOpen={featureModalOpen}
        onClose={() => setFeatureModalOpen(false)}
        items={allFeatures}
        onSelect={setSelectedFeature}
      />
      <ModalTaxonomy
        title="Set"
        isOpen={setModalOpen}
        onClose={() => setSetModalOpen(false)}
        items={allSets}
        onSelect={setSelectedSet}
      />
    </div>
  );
};

export default CardsPage;