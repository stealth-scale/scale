/**
 * Builds the checkbox cards the part specifications render.
 */

import { type ReactElement } from "react";

import { fireEvent } from "@testing-library/react";

import { settled } from "@stealthscale/testing-react";

import { Addon } from "#checkbox-card/addon.tsx";
import { Content } from "#checkbox-card/content.ts";
import { Control } from "#checkbox-card/control.tsx";
import { Description } from "#checkbox-card/description.tsx";
import { Indicator } from "#checkbox-card/indicator.tsx";
import { Label } from "#checkbox-card/label.tsx";
import { Root, type RootProps } from "#checkbox-card/root.tsx";

/**
 * Describes which of a composed card's optional parts render.
 */
export interface Composition {
  /**
   * Whether the card renders its addon. Defaults to true.
   */
  readonly added?: boolean | undefined;

  /**
   * Whether the card renders its description. Defaults to true.
   */
  readonly described?: boolean | undefined;
}

/**
 * Renders one card with a title, a description, a box with both marks and an addon.
 *
 * @param props - The props of the root.
 * @param composition - Whether the description and the addon render.
 * @returns The card.
 */
export function card(
  props: RootProps = {},
  { added = true, described = true }: Composition = {},
): ReactElement {
  return (
    <Root {...props}>
      <Content>
        <Label>Email</Label>
        {described ? <Description>A summary every morning.</Description> : null}
        <Control>
          <Indicator>
            <svg data-testid="check" />
          </Indicator>
          <Indicator indeterminate>
            <svg data-testid="dash" />
          </Indicator>
        </Control>
      </Content>
      {added ? <Addon>Free</Addon> : null}
    </Root>
  );
}

/**
 * Presses an element and waits for the machine to settle.
 *
 * @param control - The element to press.
 * @returns A promise that resolves once the machine has settled.
 */
export async function pressed(control: HTMLElement): Promise<void> {
  fireEvent.click(control);
  await settled();
}
