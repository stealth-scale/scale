/**
 * Draws a whole row: its box, its mark, its words, the line under them and the check at its end.
 *
 * @remarks
 *   The parts a row is built from are published beside this, and a row that holds something else
 *   composes them. This draws the row almost every list wants, so a caller writes one element per
 *   row rather than six, and every row of a list comes out the same shape.
 *   The box or the check comes from the list rather than from the row. The root states which once,
 *   with the mark to draw, so a list cannot end up with a box on some rows and a check on others.
 *   The words and the line under them are held in a column, which keeps the mark at the end level
 *   with the first line however tall the row grows. A row with no line under it is the same column
 *   holding one thing, because a row that changed its layout when a description appeared would
 *   shift its mark by a pixel or two against the rows around it.
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
 * Describes what a ready-made row takes.
 */
export interface RowProps extends ItemProps {
  /**
   * Written under the row's words, for a name that does not tell a reader enough to choose.
   */
  readonly description?: ReactNode | undefined;

  /**
   * Drawn before the row's words, saying what kind of thing the row is.
   */
  readonly icon?: ReactNode | undefined;
}

/**
 * Draws one row of a list the way almost every list draws one.
 *
 * @param props - The row of the collection, its words, and what it draws beside them.
 * @returns The row, holding its box or its check, its mark, its words and the line under them.
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
