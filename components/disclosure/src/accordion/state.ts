/**
 * Provides an item's options and the collapsible machine that animates its content to the parts
 * inside the item.
 */

import { createRequiredContext } from "@stealthscale/hooks";

import { type ItemOptions } from "#accordion/machine.ts";
import { type CollapsibleApi } from "#collapsible/machine.ts";

/**
 * Describes what an item provides to its parts.
 */
export interface ItemState {
  /**
   * Connected api of the collapsible machine the item runs for its content.
   */
  readonly collapsible: CollapsibleApi;

  /**
   * Value of the item and whether it is disabled, as the accordion machine reads them.
   */
  readonly options: ItemOptions;
}

/**
 * Creates the context through which an item provides its state to its parts.
 *
 * @remarks
 *   `useItem` throws when no `Accordion.Item` is mounted above the calling part.
 */
export const [ItemProvider, useItem] = createRequiredContext<ItemState>("Accordion.Item");
