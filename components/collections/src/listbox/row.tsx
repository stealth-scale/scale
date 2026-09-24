/**
 * Renders a ready-made row: its checkbox or end mark, its icon, its text and its description.
 *
 * @remarks
 *   The root states `boxed` and the mark once, so every row of a list renders the same checkbox or
 *   end mark. The text and the description render in one column, and the row centres the checkbox,
 *   the icon and the end mark on its height.
 */

import { type ReactElement, type ReactNode } from "react";

import {
  Item,
  ItemCheckbox,
  ItemDescription,
  ItemIndicator,
  ItemLines,
  type ItemProps,
  ItemText,
} from "#listbox/parts.ts";
import { useShown } from "#listbox/shown.ts";

/**
 * Describes the props of a ready-made row: a description, an icon and the props of an item.
 */
export interface RowProps extends ItemProps {
  /**
   * Description rendered under the row's text.
   */
  readonly description?: ReactNode | undefined;

  /**
   * Icon rendered before the row's text.
   */
  readonly icon?: ReactNode | undefined;
}

/**
 * Renders one row with the checkbox or end mark the root states.
 *
 * @param props - The collection item, the text as children, an icon, a description and the props
 *   of an item.
 * @returns The item `div` with `role="option"`.
 */
export function Row({ children, description, icon, item, ...rest }: RowProps): ReactElement {
  const { boxed, mark } = useShown();

  return (
    <Item {...rest} item={item}>
      {boxed ? <ItemCheckbox>{mark}</ItemCheckbox> : null}
      {icon}
      <ItemLines>
        <ItemText item={item}>{children}</ItemText>
        {description === undefined ? null : <ItemDescription>{description}</ItemDescription>}
      </ItemLines>
      {boxed ? null : <ItemIndicator item={item}>{mark}</ItemIndicator>}
    </Item>
  );
}
