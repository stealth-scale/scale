/**
 * Renders one item of a repeat group with the button that removes it.
 *
 * @remarks
 *   Every item after the first has a hairline above it. The button is the library's `Button`, which
 *   shows `<id>.actions.remove` and is named `<id>.actions.removeItem` with the item's number, so a
 *   screen reader tells the buttons of a group apart. The foundation gives no remove function while
 *   the array has no more items than its schema requires, and the button is left out then. The
 *   root element has the id the foundation gives it. Focus moves into an item by that id once one
 *   is added or removed.
 */

import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { omitUndefined } from "@stealthscale/hooks";
import { type ItemProps, useWords } from "@stealthscale/provider-form";

import { withContext } from "#form/context.ts";
import { useFormScope } from "#form/scope.ts";

/**
 * Renders the item's `div` with the form's item class.
 */
const Row = withContext("div", "item");

/**
 * Renders the row of buttons with the form's actions class.
 */
const Actions = withContext("div", "actions");

/**
 * Renders an item's members and the button that removes the item.
 *
 * @param props - The members, the id, the index and the function that removes the item.
 * @returns The item's element, with its members and, where the item can go, its remove button.
 */
export function Item({ children, id, index, onRemove }: ItemProps): ReactElement {
  const words = useWords();
  const { size } = useFormScope();

  return (
    <Row data-index={index} id={id}>
      {children}
      {onRemove === undefined ? null : (
        <Actions>
          <Button
            aria-label={words.action("removeItem", "Remove item {{number}}", { number: index + 1 })}
            onClick={onRemove}
            variant="outline"
            {...omitUndefined({ size })}
          >
            {words.action("remove", "Remove")}
          </Button>
        </Actions>
      )}
    </Row>
  );
}
