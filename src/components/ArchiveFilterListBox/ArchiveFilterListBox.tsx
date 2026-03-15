"use client";

import React, { useEffect, useState, Fragment, FC } from "react";
import { Listbox, Transition } from "@/app/headlessui";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import Button from "../Button/Button";

export interface ArchiveFilterListBoxProps<
  T extends { name: string; value?: string }
> {
  className?: string;
  lists: T[];
  onChange?: (value: T) => void;
  defaultValue?: T;
  onOpenRarityModal?: () => void;
  onOpenColorModal?: () => void;
  onOpenFeatureModal?: () => void;
  onOpenSetModal?: () => void;
}

function ArchiveFilterListBox<T extends { name: string; value?: string }>({
  className = "",
  lists,
  onChange,
  defaultValue,
  onOpenRarityModal,
  onOpenColorModal,
  onOpenFeatureModal,
  onOpenSetModal,
}: ArchiveFilterListBoxProps<T>) {
  const [selected, setSelected] = useState(defaultValue || lists[0]);

  useEffect(() => {
    setSelected(defaultValue || lists[0]);
  }, [defaultValue?.name]);

  const handleChange = (value: T) => {
    setSelected(value);

    switch (value.value) {
      case "rarity":
        onOpenRarityModal?.();
        return;
      case "color":
        onOpenColorModal?.();
        return;
      case "feature":
        onOpenFeatureModal?.();
        return;
      case "set":
        onOpenSetModal?.();
        return;
      default:
        break;
    }

    onChange?.(value);
  };

  return (
    <div className={`nc-ArchiveFilterListBox flex-shrink-0 ${className}`}>
      <Listbox value={selected} onChange={handleChange} defaultValue={defaultValue}>
        <div className="relative">
          <Listbox.Button as={"div"}>
            <Button pattern="third" fontSize="text-sm font-medium">
              {selected.name}
              <ChevronDownIcon className="w-4 h-4 ms-2 -me-1" aria-hidden="true" />
            </Button>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute end-0 w-52 py-1 mt-2 overflow-auto text-sm text-neutral-900 dark:text-neutral-200 bg-white rounded-xl shadow-lg max-h-96 ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-900 dark:ring-neutral-700 z-50">
              {lists.map((item, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `${
                      active
                        ? "text-primary-700 dark:text-neutral-200 bg-primary-50 dark:bg-neutral-700"
                        : ""
                    } cursor-default select-none relative py-2 ps-10 pe-4`
                  }
                  value={item}
                >
                  {({ selected }) => (
                    <>
                      <span className={`${selected ? "font-medium" : "font-normal"} block truncate`}>
                        {item.name}
                      </span>
                      {selected && (
                        <span className="text-primary-700 absolute inset-y-0 start-0 flex items-center ps-3 dark:text-neutral-200">
                          <CheckIcon className="w-5 h-5" aria-hidden="true" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

export default ArchiveFilterListBox;