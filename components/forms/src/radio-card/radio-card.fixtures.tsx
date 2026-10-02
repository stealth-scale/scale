/**
 * Builds the sets of radio cards the part specifications render.
 */

import { type ReactElement } from "react";

import { ItemAddon } from "#radio-card/item-addon.tsx";
import { ItemContent } from "#radio-card/item-content.ts";
import { ItemDescription } from "#radio-card/item-description.tsx";
import { ItemIndicator } from "#radio-card/item-indicator.tsx";
import { ItemText } from "#radio-card/item-text.tsx";
import { Item } from "#radio-card/item.tsx";
import { Label } from "#radio-card/label.tsx";
import { Root, type RootProps } from "#radio-card/root.tsx";

/**
 * Cards every composed set offers, in order.
 */
export const SPEEDS = [
  { addon: "Free", description: "Three to five days.", title: "Standard" },
  { addon: "£4.95", description: "Leaves overnight.", title: "Next day" },
  { addon: "£12.00", description: "Leaves before six.", title: "Same day" },
] as const;

/**
 * Describes how a composed set differs from the default one.
 */
export interface Composition {
  /**
   * Title of the card rendered disabled, or none.
   */
  readonly closed?: (typeof SPEEDS)[number]["title"] | undefined;

  /**
   * Whether the set renders `RadioCard.Label`. Defaults to true.
   */
  readonly labelled?: boolean | undefined;
}

/**
 * Renders a set of three cards, with the props the case sets on the root.
 *
 * @param props - The props of the root.
 * @param composition - The card rendered disabled, and whether the label renders.
 * @returns The set.
 */
export function composed(
  props: RootProps = {},
  { closed, labelled = true }: Composition = {},
): ReactElement {
  return (
    <Root {...props}>
      {labelled ? <Label>Delivery speed</Label> : null}
      {SPEEDS.map(({ addon, description, title }) => (
        <Item disabled={title === closed} key={title} value={title}>
          <ItemContent>
            <ItemText>{title}</ItemText>
            <ItemDescription>{description}</ItemDescription>
            <ItemIndicator />
          </ItemContent>
          <ItemAddon>{addon}</ItemAddon>
        </Item>
      ))}
    </Root>
  );
}
