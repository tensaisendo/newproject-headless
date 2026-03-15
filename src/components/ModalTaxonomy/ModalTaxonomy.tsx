import React, { FC } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface ModalTaxonomyProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  items: string[];
  onSelect: (value: string) => void;
}

const ModalTaxonomy: FC<ModalTaxonomyProps> = ({ title, isOpen, onClose, items, onSelect }) => {
  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={React.Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg w-full max-w-sm p-4">
              <Dialog.Title className="text-lg font-semibold mb-4">{title}</Dialog.Title>
              <div className="flex flex-col gap-2 max-h-96 overflow-auto">
                {items.map((item, idx) => (
                  <button
                    key={idx}
                    className="py-2 px-3 rounded hover:bg-gray-100 dark:hover:bg-neutral-700 text-left"
                    onClick={() => { onSelect(item); onClose(); }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalTaxonomy;