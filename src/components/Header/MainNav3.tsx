import React, { FC } from "react";
import AvatarDropdown from "./AvatarDropdown";
import SwitchDarkMode from "../SwitchDarkMode/SwitchDarkMode";
import Input from "../Input/Input";
import Navigation from "../Navigation/Navigation";
import { MainNav1Props } from "./MainNav1";
import Brand from "./Brand";
import { useRouter } from "next/router";
import CreateBtn from "./CreateBtn";
import dynamic from "next/dynamic";
import getTrans from "@/utils/getTrans";
import { SearchIcon } from "../Icons/Icons";
import Link from "next/link";

const DynamicMenuBar = dynamic(() => import("@/components/MenuBar/MenuBar"), {
  ssr: false,
});

export interface MainNav2Props extends MainNav1Props {}

const MainNav2: FC<MainNav2Props> = ({ menuItems, description, title }) => {
  const renderSearchIcon = () => {
    return (
      <Link
        className="block lg:hidden relative self-center"
        href="/search/posts/"
      >
        <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none flex items-center justify-center">
          <SearchIcon className="w-5 h-5" />
        </button>
      </Link>
    );
  };

  return (
    <div className="nc-MainNav2 relative z-10 bg-white dark:bg-neutral-900 border-b border-neutral-200/70 dark:border-transparent">
      <div className="px-4 xl:container">
        <div className="h-16 sm:h-20 flex justify-between">
          <div className="flex items-center lg:hidden flex-1">
            <DynamicMenuBar menuItems={menuItems} />
          </div>

          <div className="hidden lg:flex items-center gap-x-3 sm:gap-x-8">
            <Brand title={title} description={description} />
            <div className="hidden md:block h-8 border-s border-neutral-200 dark:border-neutral-700"></div>
            <div className="hidden sm:block w-64 xl:w-80 max-w-xs">
              <HeaderSearchForm />
            </div>
          </div>

          <div className="flex items-center justify-center lg:hidden flex-1">
            <Brand title={title} description={description} />
          </div>

          <div className="flex-1 flex justify-end">
            <Navigation
              maxItemsToShow={3}
              menuItems={menuItems}
              variation="nav2"
              className="hidden lg:flex"
            />
            <div className="hidden md:block border-l border-neutral-200 dark:border-neutral-700 self-center h-8 mx-2"></div>
            <CreateBtn className="self-center hidden md:flex" />
            <SwitchDarkMode className="self-center hidden md:flex" />
            {renderSearchIcon()}
            <AvatarDropdown className="self-center" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const HeaderSearchForm = () => {
  const router = useRouter();
  const T = getTrans();

  return (
    <form
      className="relative group"
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/search/posts/" + e.currentTarget.search.value || "");
      }}
    >
      <Input
        type="search"
        placeholder={T["Type to search..."]}
        className="pr-5 md:pr-10 !w-40 md:!w-full group-hover:border-neutral-300 dark:group-hover:border-neutral-400 dark:placeholder:text-neutral-400"
        sizeClass="h-[42px] pl-4 py-3"
        name="search"
        id="search"
        rounded="rounded-full"
      />
      <button
        type="submit"
        className="absolute inset-y-0 end-0 ps-2 pe-3 text-neutral-500 dark:text-neutral-400 flex items-center justify-center rounded-full"
      >
        <SearchIcon className="w-5 h-5" />
      </button>
    </form>
  );
};

export default MainNav2;
