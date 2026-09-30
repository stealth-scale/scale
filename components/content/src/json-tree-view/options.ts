/**
 * Provides the options the root sets to the rows: the preview options, and whether a key is
 * written in quotes.
 */

import { type JsonNodePreviewOptions } from "@zag-js/json-tree-utils";

import { createRequiredContext } from "@stealthscale/hooks";

/**
 * Describes the options the rows read.
 */
export interface JsonTreeViewOptions {
  /**
   * Preview options, each set to the root's value or the utilities' default.
   */
  readonly preview: JsonNodePreviewOptions;

  /**
   * Whether a key is written in quotes, as JSON writes it.
   */
  readonly quotesOnKeys: boolean;
}

/**
 * Provides the options to the rows, and reads them back.
 *
 * @remarks
 *   `useOptions` throws for a tree rendered outside `JsonTreeView.Root`.
 */
export const [OptionsProvider, useOptions] =
  createRequiredContext<JsonTreeViewOptions>("JsonTreeView");
