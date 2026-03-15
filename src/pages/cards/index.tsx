"use client";

import React, { useState, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import ArchiveFilterListBox from "@/components/ArchiveFilterListBox/ArchiveFilterListBox";
import GridCards from "@/components/GridCards";
import { FILTERS_OPTIONS } from "@/contains/contants";
import ModalTaxonomy from "@/components/ModalTaxonomy/ModalTaxonomy";

// Typage minimal pour TypeScript
interface TaxonomyNode { name?: string; }

interface CardType {
  title: string;
  slug: string;
  cardsFields?: {
    price?: string; // 🔹 price en string
    cardTitle?: string;
    image?: { node: { sourceUrl: string } };
  };
  rarities?: { nodes: TaxonomyNode[] };
  colors?: { nodes: TaxonomyNode[] };
  features?: { nodes: TaxonomyNode[] };
  sets?: { nodes: TaxonomyNode[] };
}

// GraphQL query
const GET_CARDS = gql`
  query getCards($first: Int = 10, $after: String) {
    cards(first: $first, after: $after) {
      nodes {
        title
        slug
        cardsFields { price cardTitle image { node { sourceUrl } } }
        rarities { nodes { name } }
        colors { nodes { name } }
        features { nodes { name } }
        sets { nodes { name } }
      }
      pageInfo { endCursor hasNextPage }
    }
  }
`;

const CardsPage = () => {
  const { loading, error, data, fetchMore } = useQuery(GET_CARDS, { variables: { first: 10 } });
  const cards: CardType[] = data?.cards?.nodes || [];

  // States filtres
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);

  const [rarityModalOpen, setRarityModalOpen] = useState(false);
  const [colorModalOpen, setColorModalOpen] = useState(false);
  const [featureModalOpen, setFeatureModalOpen] = useState(false);
  const [setModalOpen, setSetModalOpen] = useState(false);

  // 🔹 Taxonomies uniques
  const allRarities = useMemo(() =>
    Array.from(new Set(cards.flatMap(c => c.rarities?.nodes.map(r => r.name || "") || []).filter(Boolean))),
    [cards]
  );
  const allColors = useMemo(() =>
    Array.from(new Set(cards.flatMap(c => c.colors?.nodes.map(cl => cl.name || "") || []).filter(Boolean))),
    [cards]
  );
  const allFeatures = useMemo(() =>
    Array.from(new Set(cards.flatMap(c => c.features?.nodes.map(f => f.name || "") || []).filter(Boolean))),
    [cards]
  );
  const allSets = useMemo(() =>
    Array.from(new Set(cards.flatMap(c => c.sets?.nodes.map(s => s.name || "") || []).filter(Boolean))),
    [cards]
  );

  // 🔹 Filtrage + tri prix
  const filteredCards = useMemo(() => {
    return cards
      .filter(c => !selectedRarity || c.rarities?.nodes?.some(r => r.name === selectedRarity))
      .filter(c => !selectedColor || c.colors?.nodes?.some(cl => cl.name === selectedColor))
      .filter(c => !selectedFeature || c.features?.nodes?.some(f => f.name === selectedFeature))
      .filter(c => !selectedSet || c.sets?.nodes?.some(s => s.name === selectedSet))
      .sort((a, b) => {
        if (!selectedPrice) return 0;
        const priceA = a.cardsFields?.price
          ? Number(a.cardsFields.price.replace(/\s/g, "").replace(",", "."))
          : 0;
        const priceB = b.cardsFields?.price
          ? Number(b.cardsFields.price.replace(/\s/g, "").replace(",", "."))
          : 0;
        return selectedPrice === "price_asc" ? priceA - priceB : priceB - priceA;
      });
  }, [cards, selectedRarity, selectedColor, selectedFeature, selectedSet, selectedPrice]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error! {error.message}</p>;

  const handleLoadMore = () => {
    if (!data.cards.pageInfo.hasNextPage) return;
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

  return (
    <div className="container pt-10 pb-16 space-y-6">
      <div className="flex flex-wrap gap-2">
        {/* Price Sort */}
        <ArchiveFilterListBox
          lists={[
            { name: "Price Low → High", value: "price_asc" },
            { name: "Price High → Low", value: "price_desc" },
          ]}
          defaultValue={selectedPrice ? { name: selectedPrice, value: selectedPrice } : undefined}
          onChange={val => setSelectedPrice(val.value || null)}
        />

        {/* Taxonomy Filters */}
        <button onClick={() => setRarityModalOpen(true)} className="px-3 py-1 border rounded-md">{selectedRarity || "Rarity"}</button>
        <button onClick={() => setColorModalOpen(true)} className="px-3 py-1 border rounded-md">{selectedColor || "Color"}</button>
        <button onClick={() => setFeatureModalOpen(true)} className="px-3 py-1 border rounded-md">{selectedFeature || "Feature"}</button>
        <button onClick={() => setSetModalOpen(true)} className="px-3 py-1 border rounded-md">{selectedSet || "Set"}</button>
      </div>

      <GridCards
        cards={filteredCards}
        loading={loading}
        showLoadmore={!!data.cards.pageInfo.hasNextPage}
        onClickLoadmore={handleLoadMore}
      />

      {/* Modals */}
      <ModalTaxonomy isOpen={rarityModalOpen} onClose={() => setRarityModalOpen(false)} items={allRarities} selectedItem={selectedRarity} onSelect={setSelectedRarity} />
      <ModalTaxonomy isOpen={colorModalOpen} onClose={() => setColorModalOpen(false)} items={allColors} selectedItem={selectedColor} onSelect={setSelectedColor} />
      <ModalTaxonomy isOpen={featureModalOpen} onClose={() => setFeatureModalOpen(false)} items={allFeatures} selectedItem={selectedFeature} onSelect={setSelectedFeature} />
      <ModalTaxonomy isOpen={setModalOpen} onClose={() => setSetModalOpen(false)} items={allSets} selectedItem={selectedSet} onSelect={setSelectedSet} />
    </div>
  );
};

export default CardsPage;