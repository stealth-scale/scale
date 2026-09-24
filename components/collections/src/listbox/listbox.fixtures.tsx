/**
 * Builds the listboxes the part specifications render.
 */

import { type ReactElement, type ReactNode } from "react";

import { Content } from "#listbox/content.tsx";
import { ItemIndicator } from "#listbox/item-indicator.tsx";
import { ItemText } from "#listbox/item-text.tsx";
import { Item } from "#listbox/item.tsx";
import { Label } from "#listbox/label.tsx";
import { Root, type RootProps } from "#listbox/root.tsx";
import { COLLECTION, ROWS } from "#listbox/rows.fixtures.ts";

/**
 * Renders the children inside a root over the three-row collection.
 *
 * @param children - The part under test.
 * @param props - The props of the root.
 * @returns The root with the children inside it.
 */
export function offered(
  children: ReactNode,
  props: Omit<RootProps, "collection"> = {},
): ReactElement {
  return (
    <Root collection={COLLECTION} {...props}>
      {children}
    </Root>
  );
}

/**
 * Renders a listbox with a label and the three rows, each with its text and mark.
 *
 * @param props - The props of the root.
 * @returns The listbox.
 */
export function composed(props: Omit<RootProps, "collection"> = {}): ReactElement {
  return (
    <Root collection={COLLECTION} {...props}>
      <Label>Places</Label>
      <Content>
        {ROWS.map((row) => (
          <Item item={row} key={row.value}>
            <ItemText item={row}>{row.label}</ItemText>
            <ItemIndicator item={row}>t</ItemIndicator>
          </Item>
        ))}
      </Content>
    </Root>
  );
}
