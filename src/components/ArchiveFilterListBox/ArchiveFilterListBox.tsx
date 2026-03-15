import React, { useState, useEffect, Fragment, FC } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import Button from "../Button/Button";

interface ArchiveFilterListBoxProps<T extends { name: string; value?: string }> {
  className?: string;
  lists: T[];
  defaultValue?: T;
  onChange?: (value: T) => void;
}

const ArchiveFilterListBox = <T extends { name: string; value?: string }>({
  className = "",
  lists,
  defaultValue,
  onChange,
}: ArchiveFilterListBoxProps<T>) => {
  const [selected, setSelected] = useState(defaultValue || lists[0]);

  useEffect(() => { setSelected(defaultValue || lists[0]); }, [defaultValue?.name]);

  return (
    <div className={`nc-ArchiveFilterListBox flex-shrink-0 ${className}`}>
      <Listbox value={selected} onChange={val => { setSelected(val); onChange && onChange(val); }}>
        <div className="relative">
          <Listbox.Button as={"div"}>
            <Button pattern="third" fontSize="text-sm font-medium">
              {selected.name} <ChevronDownIcon className="w-4 h-4 ms-2 -me-1" />
            </Button>
          </Listbox.Button>
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options className="absolute end-0 w-52 py-1 mt-2 overflow-auto text-sm bg-white dark:bg-neutral-900 rounded-xl shadow-lg max-h-96 z-50">
              {lists.map((item, idx) => (
                <Listbox.Option key={idx} value={item} className={({ active }) => `${active ? "bg-primary-50 dark:bg-neutral-700" : ""} cursor-default select-none relative py-2 ps-10 pe-4`}>
                  {({ selected }) => (
                    <>
                      <span className={`${selected ? "font-medium" : "font-normal"} block truncate`}>{item.name}</span>
                      {selected && <span className="absolute inset-y-0 start-0 flex items-center ps-3"><CheckIcon className="w-5 h-5" /></span>}
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
};

export default ArchiveFilterListBox;