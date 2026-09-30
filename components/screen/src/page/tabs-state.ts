/**
 * Provides a page's tab list to its tabs, and the panel the selected tab controls to the body.
 *
 * @remarks
 *   A tab lists itself with its tab list, because a narrow page renders the tabs as rows of a
 *   picker and the picker needs every tab's words, count and value. The tabs and the body are in
 *   different bands, so the root provides the panel, the tab list sets it while it renders a tab
 *   list, and the body reads it. A picker controls no panel.
 */

import { createContext, use, useState } from "react";

import { createRequiredContext, useConst, useSafeLayoutEffect } from "@stealthscale/hooks";

/**
 * Describes one tab as the picker lists it.
 */
export interface ListedTab {
  /**
   * Number the tab's badge shows, which the picker's row renders after the words.
   */
  readonly count?: number | undefined;

  /**
   * Whether the tab is disabled.
   */
  readonly disabled: boolean;

  /**
   * Words of the tab.
   */
  readonly label: string;

  /**
   * Value the tab selects.
   */
  readonly value: string;
}

/**
 * Describes the functions a tab list provides to its tabs.
 */
export interface Listing {
  /**
   * Adds a tab at the end of the list, or replaces the tab of the same value in place.
   */
  readonly put: (tab: ListedTab) => void;

  /**
   * Removes the tab of a value.
   */
  readonly remove: (value: string) => void;
}

/**
 * Describes the state a tab list provides to its tabs.
 */
export interface TabListState extends Listing {
  /**
   * Whether the list renders a picker, which renders the tabs as its rows.
   */
  readonly narrow: boolean;
}

/**
 * Creates the context through which a tab list provides its state to its tabs.
 */
export const [TabListProvider, useTabList] = createRequiredContext<TabListState>("Page.TabList");

/**
 * Describes the panel the selected tab controls, which is the page's body.
 */
export interface Panel {
  /**
   * Id the body sets and every tab's `aria-controls` names.
   */
  readonly id: string;

  /**
   * Id of the selected tab, which names the panel.
   */
  readonly labelledBy: string;
}

/**
 * Describes the panel state the root provides.
 */
export interface PanelState {
  /**
   * Panel the body renders as, or undefined while no tab list is rendered.
   */
  readonly panel: Panel | undefined;

  /**
   * Sets the panel, or clears it.
   */
  readonly setPanel: (panel: Panel | undefined) => void;
}

/**
 * Context through which the root provides the panel state to the tab list and the body.
 */
export const PanelContext = createContext<PanelState | undefined>(undefined);

/**
 * Returns the panel state of the nearest page, or undefined outside a page.
 */
export function usePanel(): PanelState | undefined {
  return use(PanelContext);
}

/**
 * Returns the id of a tab, derived from the id of its tab list's panel and the tab's value.
 */
export function tabIdOf(panelId: string, value: string): string {
  return `${panelId}-${value}`;
}

/**
 * Sets the page's panel to the body, named by the selected tab, while a tab list renders.
 *
 * @remarks
 *   The effect clears the panel when the tab list renders a picker, selects nothing or unmounts,
 *   so the body is a tab panel only while a tab names it.
 * @param id - The panel's id.
 * @param selected - Value of the selected tab, or undefined while the list renders a picker.
 */
export function usePanelled(id: string, selected: string | undefined): void {
  const setPanel = usePanel()?.setPanel;

  useSafeLayoutEffect((): (() => void) | undefined => {
    if (setPanel === undefined) return undefined;

    setPanel(selected === undefined ? undefined : { id, labelledBy: tabIdOf(id, selected) });

    return (): void => {
      setPanel(undefined);
    };
  }, [id, selected, setPanel]);
}

/**
 * Returns whether two listed tabs render the same row.
 */
function same(one: ListedTab, other: ListedTab): boolean {
  return (
    one.count === other.count &&
    one.disabled === other.disabled &&
    one.label === other.label &&
    one.value === other.value
  );
}

/**
 * Returns the tabs with a tab added at the end, or replaced in place, and the same array when the
 * tab is unchanged.
 */
function placed(held: readonly ListedTab[], tab: ListedTab): readonly ListedTab[] {
  const at = held.findIndex((each) => each.value === tab.value);
  const kept = held[at];

  if (kept === undefined) return [...held, tab];

  return same(kept, tab) ? held : held.with(at, tab);
}

/**
 * Keeps a tab list's tabs and the functions that list them.
 *
 * @remarks
 *   The functions keep their identity for the list's lifetime, so a tab's listing effect runs when
 *   the tab mounts and not when the list renders.
 * @returns The tabs in the order they were listed, and the functions to provide to them.
 */
export function useListed(): readonly [tabs: readonly ListedTab[], listing: Listing] {
  const [tabs, setTabs] = useState<readonly ListedTab[]>([]);
  const listing = useConst<Listing>(() => ({
    put: (tab): void => {
      setTabs((held) => placed(held, tab));
    },
    remove: (value): void => {
      setTabs((held) => held.filter((each) => each.value !== value));
    },
  }));

  return [tabs, listing];
}
