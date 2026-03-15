"use client";

import React, { FC, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface ModalTaxonomyProps {
  isOpen: boolean;
  onClose: () => void;
  items: string[];
  selectedItem: string | null;
  onSelect: (item: string | null) => void; // permet null pour reset
}

const ModalTaxonomy: FC<ModalTaxonomyProps> = ({ isOpen, onClose, items, selectedItem, onSelect }) => {
  const [tempSelected, setTempSelected] = useState<string | null>(selectedItem);

  // Mettre à jour tempSelected quand la modal s'ouvre avec un selectedItem existant
  useEffect(() => {
    if (isOpen) setTempSelected(selectedItem);
  }, [isOpen, selectedItem]);

  const handleOk = () => {
    onSelect(tempSelected);
    onClose();
  };

  const handleReset = () => {
    setTempSelected(null);
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-md p-4">
              <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Select
              </Dialog.Title>

              <div className="space-y-2 max-h-96 overflow-auto mb-4">
                {items.map(item => (
                  <button
                    key={item}
                    className={`w-full text-left px-3 py-2 rounded-md ${
                      tempSelected === item
                        ? "bg-primary-500 text-white"
                        : "hover:bg-gray-200 dark:hover:bg-neutral-700"
                    }`}
                    onClick={() => setTempSelected(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  className="px-3 py-1 rounded-md border text-sm"
                  onClick={handleReset}
                >
                  Reset
                </button>
                <button
                  className="px-3 py-1 rounded-md bg-primary-500 text-white text-sm"
                  onClick={handleOk}
                >
                  OK
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalTaxonomy;