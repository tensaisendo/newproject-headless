"use client";

import React, { FC } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface ModalTaxonomyProps {
  isOpen: boolean;
  onClose: () => void;
  items: string[];
  onSelect: (value: string) => void;
  title: string;
}

const ModalTaxonomy: FC<ModalTaxonomyProps> = ({ isOpen, onClose, items, onSelect, title }) => {
  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300" enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200" leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300" enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200" leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white dark:bg-neutral-900 rounded-xl max-w-sm w-full p-6 space-y-4">
              <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
              <ul className="space-y-2 max-h-64 overflow-auto">
                {items.map((item, i) => (
                  <li key={i}>
                    <button
                      className="w-full text-left px-3 py-2 rounded hover:bg-primary-50 dark:hover:bg-neutral-800"
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex justify-end">
                <button className="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200" onClick={onClose}>Close</button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalTaxonomy;