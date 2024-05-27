import React, { FC } from "react";
import { useThemeMode } from "@/hooks/useThemeMode";
import { FragmentType } from "@/__generated__";
import { NC_PRIMARY_MENU_QUERY_FRAGMENT } from "@/fragments/menu";
import MainNav2 from "@/components/Header/MainNav2";
import MainNav3 from "@/components/Header/MainNav3";
import Banner from "@/components/Banner";
import { NC_SITE_SETTINGS } from "@/contains/site-settings";

interface Props {
  menuItems: FragmentType<typeof NC_PRIMARY_MENU_QUERY_FRAGMENT>[];
  siteTitle?: string | null;
  siteDescription?: string | null;
}

const SiteHeader: FC<Props> = ({ menuItems, siteDescription, siteTitle }) => {
  //
  useThemeMode();
  //
  return (
    <>
      <Banner />

      <div className="sticky top-0 w-full z-30">
        {NC_SITE_SETTINGS.site_header.desktop_header.header_style ===
        "style2" ? (
          <MainNav3
            menuItems={menuItems}
            title={siteTitle}
            description={siteDescription}
          />
        ) : (
          <MainNav2
            menuItems={menuItems}
            title={siteTitle}
            description={siteDescription}
          />
        )}
      </div>
    </>
  );
};

export default SiteHeader;
