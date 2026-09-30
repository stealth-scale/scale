/**
 * Renders one panel of a splitter.
 *
 * @remarks
 *   The machine sizes the panel inline through its flex properties and its `min-` and `max-`
 *   sizes, clips what overflows it, and turns off pointer events inside it while a trigger drags.
 *   Content that scrolls inside a panel renders in its own scroll area.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#splitter/context.ts";
import { useSplitterContext } from "#splitter/machine.ts";

/**
 * Renders the `div` with the recipe's panel class.
 */
const Drawn = withContext("div", "panel");

/**
 * Describes the props of a panel: its id among the machine's panels and the props of a `div`.
 */
export interface PanelProps extends Omit<ComponentProps<typeof Drawn>, "id"> {
  /**
   * Id of the panel in the `panels` passed to `useSplitter`. The machine derives the element's id
   * from it.
   */
  readonly id: string;
}

/**
 * Renders the panel with the machine's panel props merged under the caller's.
 *
 * @param props - The panel's id and the props of a `div`.
 * @returns The `div` element.
 */
export function Panel({ id, ...props }: PanelProps): ReactElement {
  const api = useSplitterContext();

  return <Drawn {...mergeProps(api.getPanelProps({ id }), props)} />;
}
