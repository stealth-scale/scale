/**
 * Renders the text of the selected rows.
 *
 * @remarks
 *   The text is the machine's `valueAsString`, which joins the selected rows' text.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#listbox/context.ts";
import { useListbox } from "#listbox/machine.ts";

/**
 * Renders the `span` with the listbox's value text class.
 */
const Chosen = withContext("span", "valueText");

/**
 * Describes the props of the value text: a placeholder and the props of a `span`.
 */
export interface ValueTextProps extends ComponentProps<typeof Chosen> {
  /**
   * Text rendered while nothing is selected.
   */
  readonly placeholder?: ReactNode;
}

/**
 * Renders the selected rows' text, or the placeholder while nothing is selected.
 *
 * @remarks
 *   Children render in place of both. The placeholder renders only while `valueAsString` is empty.
 * @param props - The placeholder, and the attributes and children of the `span` element.
 * @returns The `span` element.
 */
export function ValueText({ children, placeholder, ...rest }: ValueTextProps): ReactElement {
  const api = useListbox();

  return (
    <Chosen {...mergeProps(api.getValueTextProps(), rest)}>
      {children ?? (api.valueAsString === "" ? placeholder : api.valueAsString)}
    </Chosen>
  );
}
