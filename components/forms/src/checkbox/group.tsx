/**
 * Renders a list of checkboxes that share one value: the values of the boxes that are checked.
 *
 * @remarks
 *   The element is a `div` without a role. A `Fieldset.Root` around the group names the set through
 *   its legend and gives it its helper and error texts. Inside a `Field`, a caller renders the
 *   group as a `fieldset` through `as` and names it through `aria-labelledby` at the field's label,
 *   as the form binding does. The group takes the fieldset's invalid state and the field's or the
 *   fieldset's size unless it states its own, and passes its state and size to every box inside it.
 *   `data-orientation` reports the orientation to the recipe.
 */

import { type ComponentProps, type ReactElement } from "react";

import { omitUndefined, useControllableState } from "@stealthscale/hooks";

import { withGroupContext } from "#checkbox/context.ts";
import { GroupProvider } from "#checkbox/grouping.ts";
import { sized } from "#field/inherited.ts";
import { useOptionalField } from "#field/state.ts";
import { useFieldset } from "#fieldset/state.ts";

/**
 * Renders the group's `div` with the group recipe's variants.
 */
const Listed = withGroupContext("div");

/**
 * Value of a group that states no default: no box checked.
 */
const NONE: readonly string[] = [];

/**
 * Describes the props of `Group`: the value, the state it gives its boxes, and the props of a
 * `div`.
 */
export interface GroupProps extends Omit<ComponentProps<typeof Listed>, "defaultValue"> {
  /**
   * Values a box marked `parent` checks and clears.
   */
  readonly allValues?: readonly string[] | undefined;

  /**
   * Values checked on the first render of a group whose value the caller does not control.
   */
  readonly defaultValue?: readonly string[] | undefined;

  /**
   * Whether every box in the group is disabled.
   */
  readonly disabled?: boolean | undefined;

  /**
   * Whether the group's value is invalid. Defaults to the invalid state of the fieldset around it.
   */
  readonly invalid?: boolean | undefined;

  /**
   * Largest number of values the group takes. At the limit every unchecked box is disabled.
   */
  readonly maxSelectedValues?: number | undefined;

  /**
   * Name every box submits its value under.
   */
  readonly name?: string | undefined;

  /**
   * Called with the new value after a press checks or clears a box.
   */
  readonly onValueChange?: ((value: string[]) => void) | undefined;

  /**
   * Direction the rows run in: a column, or a row that wraps.
   */
  readonly orientation?: "horizontal" | "vertical" | undefined;

  /**
   * Whether every box in the group is read-only.
   */
  readonly readOnly?: boolean | undefined;

  /**
   * Values of the checked boxes, for a group whose value the caller controls.
   */
  readonly value?: readonly string[] | undefined;
}

/**
 * Renders the group and provides its value and state to the boxes inside it.
 *
 * @param props - The value, the state the group gives its boxes, and the props of a `div`.
 * @returns The `div` element.
 */
export function Group({
  allValues,
  defaultValue = NONE,
  disabled = false,
  invalid,
  maxSelectedValues,
  name,
  onValueChange,
  orientation = "vertical",
  readOnly = false,
  size,
  value,
  ...rest
}: GroupProps): ReactElement {
  const field = useOptionalField();
  const fieldset = useFieldset();
  const [held, setValue] = useControllableState<readonly string[]>({
    defaultValue,
    onChange: (next) => {
      onValueChange?.([...next]);
    },
    value,
  });
  const sizing = sized(size, field, fieldset);

  return (
    <GroupProvider
      value={{
        allValues,
        disabled,
        invalid: invalid ?? fieldset.invalid,
        maxSelectedValues,
        name,
        readOnly,
        setValue,
        size: sizing,
        value: held,
      }}
    >
      <Listed {...rest} {...omitUndefined({ size: sizing })} data-orientation={orientation} />
    </GroupProvider>
  );
}
