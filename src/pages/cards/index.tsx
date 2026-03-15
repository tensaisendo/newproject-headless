import React, { useState, useMemo } from "react";
import { gql, useQuery } from "@apollo/client";
import GridCards from "@/components/GridCards";
import ModalTaxonomy from "@/components/ModalTaxonomy/ModalTaxonomy";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
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
          node { sourceUrl mediaDetails { height width file } }
        }
      }
      rarities { nodes { name slug } }
      colors { nodes { name slug } }
      features { nodes { name slug } }
      sets { nodes { name slug } }
    }
    pageInfo { endCursor hasNextPage }
  }
}
`;

const PRICE_OPTIONS = [
  { name: "Low → High", value: "asc" },
  { name: "High → Low", value: "desc" }
];

const CardsPage = () => {
  const { data, loading, fetchMore } = useQuery(GET_CARDS);

  const cards = data?.cards?.nodes || [];
  const pageInfo = data?.cards?.pageInfo;

  // Taxonomy Filters
  const [selectedRarity, setSelectedRarity] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<string[]>([]);
  const [selectedSet, setSelectedSet] = useState<string[]>([]);

  const [rarityOpen, setRarityOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [featureOpen, setFeatureOpen] = useState(false);
  const [setOpen, setSetOpen] = useState(false);

  // Price Filter
  const [selectedPrice, setSelectedPrice] = useState(PRICE_OPTIONS[0]);

  const handleLoadMore = () => {
    if (!pageInfo?.hasNextPage) return;

    fetchMore({
      variables: { after: pageInfo.endCursor },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          cards: {
            __typename: prev.cards.__typename,
            nodes: [...prev.cards.nodes, ...fetchMoreResult.cards.nodes],
            pageInfo: fetchMoreResult.cards.pageInfo
          }
        };
      }
    });
  };

  // Filter cards
  const filteredCards = useMemo(() => {
    let filtered = cards.filter(card => {
      const rarityOk = !selectedRarity.length || card.rarities?.nodes?.some(r => selectedRarity.includes(r.slug));
      const colorOk = !selectedColor.length || card.colors?.nodes?.some(c => selectedColor.includes(c.slug));
      const featureOk = !selectedFeature.length || card.features?.nodes?.some(f => selectedFeature.includes(f.slug));
      const setOk = !selectedSet.length || card.sets?.nodes?.some(s => selectedSet.includes(s.slug));
      return rarityOk && colorOk && featureOk && setOk;
    });

    // Sort by price if selected
    filtered.sort((a, b) => {
      const priceA = a.cardsFields?.price || 0;
      const priceB = b.cardsFields?.price || 0;
      return selectedPrice.value === "asc" ? priceA - priceB : priceB - priceA;
    });

    return filtered;
  }, [cards, selectedRarity, selectedColor, selectedFeature, selectedSet, selectedPrice]);

  // Unique items for modals
  const allRarities = [...new Map(cards.flatMap(c => c.rarities?.nodes || []).map(r => [r.slug, r])).values()];
  const allColors = [...new Map(cards.flatMap(c => c.colors?.nodes || []).map(r => [r.slug, r])).values()];
  const allFeatures = [...new Map(cards.flatMap(c => c.features?.nodes || []).map(r => [r.slug, r])).values()];
  const allSets = [...new Map(cards.flatMap(c => c.sets?.nodes || []).map(r => [r.slug, r])).values()];

  return (
    <div className="container pt-10 pb-16">

      {/* Top Filters */}
      <div className="flex flex-wrap gap-3 mb-6">

        {/* Price Listbox */}
        <Listbox value={selectedPrice} onChange={setSelectedPrice}>
          <div className="relative">
            <Listbox.Button className="px-4 py-2 border rounded">
              {selectedPrice.name}
              <ChevronDownIcon className="w-4 h-4 inline ms-2" />
            </Listbox.Button>
            <Transition as={React.Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className="absolute mt-1 w-40 bg-white dark:bg-neutral-900 border rounded shadow-lg z-50">
                {PRICE_OPTIONS.map((option) => (
                  <Listbox.Option key={option.value} value={option}>
                    {({ selected }) => (
                      <div className={`px-4 py-2 cursor-pointer ${selected ? "bg-primary-100 dark:bg-primary-700 font-semibold" : "hover:bg-neutral-100 dark:hover:bg-neutral-700"}`}>
                        {option.name}
                      </div>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>

        {/* Taxonomy Buttons */}
        <Button onClick={() => setRarityOpen(true)}>Rarity</Button>
        <Button onClick={() => setColorOpen(true)}>Color</Button>
        <Button onClick={() => setFeatureOpen(true)}>Feature</Button>
        <Button onClick={() => setSetOpen(true)}>Set</Button>

      </div>

      {/* Grid */}
      <GridCards
        cards={filteredCards}
        loading={loading}
        showLoadmore={!!pageInfo?.hasNextPage}
        onClickLoadmore={handleLoadMore}
      />

      {/* Modals */}
      <ModalTaxonomy title="Rarity" isOpen={rarityOpen} onClose={() => setRarityOpen(false)} items={allRarities} selected={selectedRarity} onSelect={setSelectedRarity} />
      <ModalTaxonomy title="Color" isOpen={colorOpen} onClose={() => setColorOpen(false)} items={allColors} selected={selectedColor} onSelect={setSelectedColor} />
      <ModalTaxonomy title="Feature" isOpen={featureOpen} onClose={() => setFeatureOpen(false)} items={allFeatures} selected={selectedFeature} onSelect={setSelectedFeature} />
      <ModalTaxonomy title="Set" isOpen={setOpen} onClose={() => setOpen(false)} items={allSets} selected={selectedSet} onSelect={setSelectedSet} />

    </div>
  );
};

export default CardsPage;