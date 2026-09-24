/**
 * Renders a group's label.
 *
 * @remarks
 *   The label takes the `value` its group has, and the machine points the group's
 *   `aria-labelledby` at it. The recipe sets it two sizes smaller than the rows, in `fg.subtle`.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#menu/context.ts";
import { useMenu } from "#menu/machine.ts";

/**
 * Renders the `div` with the menu's item group label class.
 */
const Titled = withContext("div", "itemGroupLabel");

/**
 * Describes the props of a group's label: its group's value and the props of a `div`.
 */
export interface ItemGroupLabelProps extends ComponentProps<typeof Titled> {
  /**
   * Value of the group the label names.
   */
  readonly value: string;
}

/**
 * Renders the label with the machine's item group label props merged over the caller's.
 *
 * @param props - The group's value and the props of a `div`.
 * @returns The `div` element.
 */
export function ItemGroupLabel({ value, ...rest }: ItemGroupLabelProps): ReactElement {
  const { api } = useMenu();

  return <Titled {...mergeProps(api.getItemGroupLabelProps({ htmlFor: value }), rest)} />;
}
