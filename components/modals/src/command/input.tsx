/**
 * Renders the query field and the optional glyph beside it.
 *
 * @remarks
 *   The field is the listbox's own input, so it retains focus while the active option moves through
 *   the rows and the machine keeps `aria-activedescendant` pointed at the current one. The glyph is
 *   decorative and hidden from the accessibility tree. The package ships no icon set, so the field
 *   fills the bar unless the caller supplies one.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { Listbox } from "@stealthscale/component-collections";

import { withContext } from "#command/context.ts";
import { useCommand } from "#command/state.ts";

/**
 * The styled element carrying the recipe's control slot, which is the bar around the field.
 */
const Banded = withContext("div", "control");

/**
 * The styled element carrying the recipe's indicator slot, hidden from assistive technology.
 */
const Marked = withContext("span", "indicator", { defaultProps: { "aria-hidden": true } });

/**
 * The listbox's input wrapped in the recipe's input slot, so it carries both sets of styles.
 */
const Typed = withContext(Listbox.Input, "input");

/**
 * Props of the query field, plus everything the listbox input accepts apart from the two the
 * palette controls.
 */
export interface InputProps extends Omit<ComponentProps<typeof Typed>, "onChange" | "value"> {
  /**
   * The glyph rendered before the field, usually a magnifying glass.
   */
  readonly indicator?: ReactNode;
}

/**
 * Filters the list on every keystroke while keeping focus in the field.
 */
export function Input({ indicator, ...rest }: InputProps): ReactElement {
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
    </Banded>
  );
}
