/**
 * Fixtures for the swipe actions specs: a row with a control in its content and two actions, and
 * the widths a browser would measure.
 */

import { type MouseEventHandler, type ReactElement } from "react";

import { vi } from "vitest";

import { Action } from "#swipe-actions/action.tsx";
import { Actions } from "#swipe-actions/actions.tsx";
import { Content } from "#swipe-actions/content.tsx";
import { Root, type RootProps } from "#swipe-actions/root.tsx";

/**
 * Describes the handlers of the row's two actions.
 */
export interface Pressed {
  /**
   * Called on a press on Archive.
   */
  readonly archive?: MouseEventHandler<HTMLButtonElement> | undefined;

  /**
   * Called on a press on Delete.
   */
  readonly remove?: MouseEventHandler<HTMLButtonElement> | undefined;
}

/**
 * Renders a row whose content contains an Open button, with Archive and Delete as its actions.
 *
 * @param props - The props the case sets on the root.
 * @param pressed - The actions' handlers.
 * @returns The row.
 */
export function row(props: RootProps = {}, pressed: Pressed = {}): ReactElement {
  return (
    <Root {...props}>
      <Content>
        Invoice 1042
        <button type="button">Open</button>
      </Content>
      <Actions>
        <Action onClick={pressed.archive}>Archive</Action>
        <Action onClick={pressed.remove}>Delete</Action>
      </Actions>
    </Root>
  );
}

/**
 * Renders a row with content and no actions.
 *
 * @returns The row.
 */
export function bare(): ReactElement {
  return (
    <Root>
      <Content>Invoice 1042</Content>
    </Root>
  );
}

/**
 * Renders the row and an Elsewhere button after it, outside the row.
 *
 * @returns The row and the button.
 */
export function beside(): ReactElement {
  return (
    <>
      {row()}
      <button type="button">Elsewhere</button>
    </>
  );
}

/**
 * Returns the row's root element in a render's container.
 */
export function rootOf(container: HTMLElement): HTMLElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every fixture renders one root
  return container.querySelector(".swipe-actions__root") as HTMLElement;
}

/**
 * Returns the row's content element in a render's container.
 */
export function contentOf(container: HTMLElement): HTMLElement {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- every fixture renders one content
  return container.querySelector(".swipe-actions__content") as HTMLElement;
}

/**
 * Returns the width the row reveals, as its root states it in `--swipe-reveal`.
 */
export function revealedOf(container: HTMLElement): string {
  return rootOf(container).style.getPropertyValue("--swipe-reveal");
}

/**
 * Measures every element 160px wide, as a browser measures two actions of 80px.
 *
 * @param width - The width to report, in pixels.
 */
export function laidOut(width = 160): void {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
    new DOMRect(0, 0, width, 48),
  );
}
