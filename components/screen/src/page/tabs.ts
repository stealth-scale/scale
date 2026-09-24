/**
 * Renders the slot for a strip of tabs in the navigation.
 *
 * @remarks
 *   The tabs are the disclosure package's. The slot removes their own hairline, because the
 *   navigation band has one. Render `Tabs.List` as it with `as`.
 */

import { type ComponentProps } from "react";

import { withContext } from "#page/context.ts";

/**
 * Renders the `div` with the recipe's tabs class.
 */
export const Tabs = withContext("div", "tabs");

/**
 * Describes the props of the tab strip: the props of a `div`.
 */
export type TabsProps = ComponentProps<typeof Tabs>;
