import { type ComponentType, type ReactElement, useState } from "react";

import {
  ChartColumnIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  SearchIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";

import { SearchInput } from "@stealthscale/component-forms";
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
  const [query, setQuery] = useState("");
  const wanted = query.trim().toLocaleLowerCase();
  const shown = PAGES.filter(([page]) => t(page).toLocaleLowerCase().includes(wanted));

  return (
    <Sidebar.Root variant="subtle">
      <Sidebar.Content>
        <Sidebar.Search>
          <SearchInput
            aria-label={t("filterPages")}
            clearIndicator={<XIcon />}
            clearLabel={t("clear")}
            onValueChange={setQuery}
            searchIndicator={<SearchIcon />}
            size="sm"
            value={query}
          />
        </Sidebar.Search>
        <Sidebar.Nav>
          <Sidebar.NavLabel as="h3">{t("pages")}</Sidebar.NavLabel>
          {shown.length === 0 ? (
            <Sidebar.Empty>{t("noMatch")}</Sidebar.Empty>
          ) : (
            <NavList.Root>
              {shown.map(([page, Glyph]) => (
                <NavList.Item key={page}>
                  <NavList.Link href={`#${page}`}>
                    <Glyph />
                    <span>{t(page)}</span>
                  </NavList.Link>
                </NavList.Item>
              ))}
            </NavList.Root>
          )}
        </Sidebar.Nav>
      </Sidebar.Content>
    </Sidebar.Root>
  );
}
