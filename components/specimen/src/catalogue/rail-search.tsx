/**
 * Renders the sidebar search that filters the catalogue's rail, in the catalogue's words.
 */

import { type ReactElement } from "react";

import { SearchIcon, XIcon } from "lucide-react";

import { Sidebar } from "@stealthscale/component-screen";

import { useWords } from "#words.ts";

/**
 * Key that moves focus to the field with the platform's modifier held: ⌘K and Ctrl+K.
 */
const SHORTCUT = "k";

/**
 * Describes the props of `RailSearch`: the props of the sidebar's search.
 */
export type RailSearchProps = Sidebar.SearchProps;

/**
 * Renders the sidebar's search with the catalogue's name, placeholder, marks and shortcut.
 *
 * @remarks
 *   Render it inside `Sidebar.Header`, above a `Rail` in `Sidebar.Content`. The search filters
 *   every block of the sidebar: a query keeps the pages whose titles contain it and opens their
 *   branches. ⌘K and Ctrl+K move focus to the field from anywhere in the document, and open a
 *   closed app shell panel first. The down arrow moves focus from the field to the first row the
 *   query keeps. A prop the caller passes replaces the catalogue's value.
 * @param props - The props of the sidebar's search.
 * @returns The search, or nothing on a rail that cannot open.
 */
export function RailSearch(props: RailSearchProps): null | ReactElement {
  const { t } = useWords();

  return (
    <Sidebar.Search
      aria-label={t("rail.filter")}
      clearIndicator={<XIcon />}
      clearLabel={t("rail.clear")}
      placeholder={t("rail.filter")}
      searchIndicator={<SearchIcon />}
      shortcut={SHORTCUT}
      {...props}
    />
  );
}
