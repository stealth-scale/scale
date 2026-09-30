/**
 * Fixtures for the JSON tree view specs: a payout with a nested object and an array, and a tree
 * that renders a value with the props each case sets.
 */

import { type ReactElement } from "react";

import { screen } from "@testing-library/react";

import { Root, type RootProps } from "#json-tree-view/root.tsx";
import { Tree, type TreeProps } from "#json-tree-view/tree.tsx";

/**
 * Returns the key a row renders, without quotes, or an empty string for the value's own row.
 *
 * @param row - The row.
 * @returns The key.
 */
export function keyOf(row: HTMLElement): string {
  return row.querySelector("[data-kind=key]")?.textContent?.replaceAll('"', "") ?? "";
}

/**
 * Returns the row of a key, written without quotes.
 *
 * @param key - The key.
 * @returns The row.
 * @throws {@link Error} When no row renders the key.
 */
export function rowOf(key: string): HTMLElement {
  const row = screen.queryAllByRole("treeitem").find((each) => keyOf(each) === key);

  if (row === undefined) throw new Error(`No row renders the key ${key}.`);

  return row;
}

/**
 * Returns the fixture's payout: `amount`, `customer`, the `destination` object with two keys, and
 * the `tags` array with two items.
 *
 * @returns The payout.
 */
export function payout(): Readonly<Record<string, unknown>> {
  return {
    amount: 4200,
    customer: "cus_4Q2x",
    destination: { bank: "Northwind Bank", country: "GB" },
    tags: ["urgent", "manual"],
  };
}

/**
 * Renders a tree named "Payout" over the payout, or over the case's value, with the props each case
 * sets on the root and on the tree.
 *
 * @param root - The props the case sets on the root, `data` among them.
 * @param tree - The props the case sets on the tree.
 * @returns The tree.
 */
export function composed(
  root: Partial<RootProps> = {},
  tree: Partial<TreeProps> = {},
): ReactElement {
  return (
    <Root data={payout()} {...root}>
      <Tree aria-label="Payout" arrow="›" {...tree} />
    </Root>
  );
}
