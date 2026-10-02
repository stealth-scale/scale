/**
 * Renders the query bar: an optional glyph, the field and any control after it.
 *
 * @remarks
 *   The field is the listbox's input, so it keeps focus while the highlight moves through the rows,
 *   and the machine points `aria-activedescendant` at the highlighted row. The glyph sets
 *   `aria-hidden`. The package renders no icon, so the bar shows no glyph unless the caller passes
 *   one. Children render after the field, in the bar, where `Command.Clear` goes, because an
 *   `input` takes no children.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { Listbox } from "@stealthscale/component-collections";

import { withContext } from "#command/context.ts";
import { useCommand } from "#command/state.ts";

/**
 * Renders the `div` with the recipe's control class: the bar around the field.
 */
const Banded = withContext("div", "control");

/**
 * Renders the `span` with the recipe's indicator class, hidden from assistive technology.
 */
const Marked = withContext("span", "indicator", { defaultProps: { "aria-hidden": true } });

/**
 * Renders the listbox's input with the recipe's input class beside the listbox's own, highlighting
 * the first row of every filtered list, so Enter runs the best match.
 */
const Typed = withContext(Listbox.Input, "input", { defaultProps: { autoHighlight: true } });

/**
 * Describes the props of the query bar: the glyph, and the listbox input's props without
 * `onChange` and `value`, which the palette sets.
 */
export interface InputProps extends Omit<ComponentProps<typeof Typed>, "onChange" | "value"> {
  /**
   * The glyph rendered before the field, usually a magnifying glass.
   */
  readonly indicator?: ReactNode;
}

/**
 * Renders the bar and narrows the list on every keystroke.
 *
 * @param props - The glyph, the controls after the field and the listbox input's props.
 * @returns The `div` element of the bar.
 */
export function Input({ children, indicator, ...rest }: InputProps): ReactElement {
  const palette = useCommand();

  return (
    <Banded>
      {indicator === undefined ? null : <Marked>{indicator}</Marked>}
      <Typed
        {...rest}
        onChange={(event) => {
          palette.narrow(event.target.value);
        }}
        value={palette.typed}
      />
      {children}
    </Banded>
  );
}
