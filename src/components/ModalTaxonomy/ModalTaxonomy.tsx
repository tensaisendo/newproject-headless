"use client";

import React, { FC } from "react";
import { Dialog, Transition } from "@headlessui/react";

interface ModalTaxonomyProps {
  title: string
  isOpen: boolean
  onClose: () => void
  items: {name:string, slug:string}[]
  selected: string[]
  onSelect: (value:string[]) => void
}

const ModalTaxonomy: FC<ModalTaxonomyProps> = ({
  title,
  isOpen,
  onClose,
  items,
  selected,
  onSelect
}) => {

  const toggleItem = (slug:string) => {

    if(selected.includes(slug)){
      onSelect(selected.filter(s=>s!==slug))
    }else{
      onSelect([...selected,slug])
    }

  }

  const reset = ()=> onSelect([])

  return (

<Transition show={isOpen} as={React.Fragment}>

<Dialog onClose={onClose} className="relative z-50">

<Transition.Child
enter="ease-out duration-200"
enterFrom="opacity-0"
enterTo="opacity-100"
leave="ease-in duration-150"
leaveFrom="opacity-100"
leaveTo="opacity-0"
>

<div className="fixed inset-0 bg-black/30"/>

</Transition.Child>

<div className="fixed inset-0 flex items-center justify-center p-4">

<Dialog.Panel className="bg-white dark:bg-neutral-900 rounded-xl p-6 max-w-md w-full">

<Dialog.Title className="text-lg font-semibold mb-4">
{title}
</Dialog.Title>

<div className="flex flex-col gap-2 max-h-96 overflow-y-auto">

{items.map(item=>(

<button
key={item.slug}
onClick={()=>toggleItem(item.slug)}
className={`text-left p-2 rounded ${
selected.includes(item.slug)
? "bg-primary-100 dark:bg-primary-700 font-semibold"
: "hover:bg-neutral-100 dark:hover:bg-neutral-700"
}`}
>

{item.name}

</button>

))}

</div>

<div className="flex justify-between mt-6">

<button
onClick={reset}
className="px-4 py-2 bg-gray-200 dark:bg-neutral-700 rounded"
>
Reset
</button>

<button
onClick={onClose}
className="px-4 py-2 bg-primary-600 text-white rounded"
>
Close
</button>

</div>

</Dialog.Panel>

</div>

</Dialog>

</Transition>

)

}

export default ModalTaxonomy