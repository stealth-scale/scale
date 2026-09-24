import { type ReactElement, useId } from "react";

import { BookOpenIcon, BoxIcon, CompassIcon, PaletteIcon, SquareIcon } from "lucide-react";

import { NavList } from "@stealthscale/component-navigation";
import { useWords } from "@stealthscale/specimen";

import * as Sidebar from "#sidebar/index.ts";

export function Guides(): ReactElement {
  const { t } = useWords("sidebar");
  const id = useId();

  return (
    <Sidebar.Root variant="subtle">
      <Sidebar.Header>
        <BookOpenIcon />
        <span>{t("handbook")}</span>
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Nav aria-label={t("documentation")}>
          <Sidebar.NavHeading as="h3" id={`${id}-guides`}>
            {t("guides")}
          </Sidebar.NavHeading>
          <NavList.Root aria-labelledby={`${id}-guides`}>
            <NavList.Item>
              <NavList.Link aria-current="page" href="#start">
                <CompassIcon />
                <span>{t("start")}</span>
              </NavList.Link>
            </NavList.Item>
            <NavList.Item>
              <NavList.Link href="#theming">
                <PaletteIcon />
                <span>{t("theming")}</span>
              </NavList.Link>
            </NavList.Item>
          </NavList.Root>
          <Sidebar.NavHeading as="h3" id={`${id}-components`}>
            {t("components")}
          </Sidebar.NavHeading>
          <NavList.Root aria-labelledby={`${id}-components`}>
            <NavList.Item>
              <NavList.Link href="#button">
                <SquareIcon />
                <span>{t("button")}</span>
              </NavList.Link>
            </NavList.Item>
            <NavList.Item>
              <NavList.Link href="#card">
                <BoxIcon />
                <span>{t("card")}</span>
              </NavList.Link>
            </NavList.Item>
          </NavList.Root>
        </Sidebar.Nav>
      </Sidebar.Content>
    </Sidebar.Root>
  );
}
