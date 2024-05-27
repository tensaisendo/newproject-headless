import React, { FC } from "react";
import AvatarDropdown from "./AvatarDropdown";
import SwitchDarkMode from "../SwitchDarkMode/SwitchDarkMode";
import Navigation from "../Navigation/Navigation";
import { MainNav1Props } from "./MainNav1";
import Brand from "./Brand";
import CreateBtn from "./CreateBtn";
import dynamic from "next/dynamic";
import { HeaderSearchForm } from "./MainNav3";

const DynamicMenuBar = dynamic(() => import("@/components/MenuBar/MenuBar"), {
  ssr: false,
});

export interface MainNav2Props extends MainNav1Props {}

const MainNav2: FC<MainNav2Props> = ({ menuItems, description, title }) => {
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

          <div className="flex-1 flex justify-end">
            <Navigation
              maxItemsToShow={3}
              menuItems={menuItems}
              variation="nav2"
              className="hidden lg:flex"
            />
            <div className="hidden md:block border-l border-neutral-200 dark:border-neutral-700 self-center h-8 mx-2"></div>
            <CreateBtn className="self-center" />
            <SwitchDarkMode className="self-center" />
            <AvatarDropdown className="self-center" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav2;
