import { type ComponentType, type ReactElement } from "react";

import {
  ChartColumnIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  SearchIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";

import { NavList } from "@stealthscale/component-navigation";
import { useWords } from "@stealthscale/specimen";

import * as Sidebar from "#sidebar/index.ts";

const PAGES: ReadonlyArray<readonly [string, ComponentType]> = [
  ["overview", LayoutDashboardIcon],
  ["invoices", FileTextIcon],
  ["customers", UsersIcon],
  ["reports", ChartColumnIcon],
];

export function Filter(): ReactElement {
  const { t } = useWords("sidebar");

  return (
    <Sidebar.Root variant="subtle">
      <Sidebar.Content>
        <Sidebar.Nav>
          <Sidebar.NavLabel as="h3">{t("pages")}</Sidebar.NavLabel>
          <Sidebar.Search
            aria-label={t("filterPages")}
            clearIndicator={<XIcon />}
            clearLabel={t("clearFilter")}
            placeholder={t("filterPlaceholder")}
            searchIndicator={<SearchIcon />}
          />
          <NavList.Root>
            {PAGES.map(([page, Glyph]) => (
              <NavList.Item key={page}>
                <NavList.Link href={`#${page}`}>
                  <Glyph />
                  <span>{t(page)}</span>
                </NavList.Link>
              </NavList.Item>
            ))}
          </NavList.Root>
          <Sidebar.Empty>{t("noMatch")}</Sidebar.Empty>
        </Sidebar.Nav>
      </Sidebar.Content>
    </Sidebar.Root>
  );
}
