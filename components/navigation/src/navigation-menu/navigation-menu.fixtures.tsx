/**
 * Fixtures for the navigation menu specs: a bar of two triggers and a link with panels in place,
 * the same bar with an indicator and a shared viewport, a part inside an item, and the pointer
 * moves and waits the machine's delays need.
 */

import { type ReactElement, type ReactNode } from "react";

import { act, fireEvent } from "@testing-library/react";
import { vi } from "vitest";

import { settled } from "@stealthscale/testing-react";

import {
  Content,
  Indicator,
  Item,
  Link,
  List,
  Root,
  type RootProps,
  Trigger,
  Viewport,
  ViewportPositioner,
  type ViewportPositionerProps,
} from "#navigation-menu/index.ts";

/**
 * Renders the items of the bar: Products and Company open panels of links, and Pricing is a link
 * to the page on screen.
 *
 * @returns The three items.
 */
function items(): ReactElement {
  return (
    <>
      <Item value="products">
        <Trigger>Products</Trigger>
        <Content>
          <Link href="#ledger">Ledger</Link>
          <Link href="#payments">Payments</Link>
        </Content>
      </Item>
      <Item value="company">
        <Trigger>Company</Trigger>
        <Content>
          <Link href="#careers">Careers</Link>
        </Content>
      </Item>
      <Item value="pricing">
        <Link current href="#pricing">
          Pricing
        </Link>
      </Item>
    </>
  );
}

/**
 * Renders a bar whose panels open in place under their triggers, with the props the case sets on
 * the root.
 *
 * @param props - The props the case sets on the root.
 * @returns The navigation menu.
 */
export function composed(props: RootProps = {}): ReactElement {
  return (
    <Root aria-label="Site" {...props}>
      <List>{items()}</List>
    </Root>
  );
}

/**
 * Renders a bar with an indicator whose panels open in a shared viewport, with the props the case
 * sets on the root and the positioner.
 *
 * @param props - The props the case sets on the root.
 * @param positioner - The props the case sets on the viewport's positioner.
 * @returns The navigation menu.
 */
export function viewed(
  props: RootProps = {},
  positioner: ViewportPositionerProps = {},
): ReactElement {
  return (
    <Root aria-label="Site" {...props}>
      <List>
        {items()}
        <Indicator />
      </List>
      <ViewportPositioner {...positioner}>
        <Viewport />
      </ViewportPositioner>
    </Root>
  );
}

/**
 * Renders a part inside the item Products of a root, beside the item's trigger.
 *
 * @param children - The part under test.
 * @param props - The props the case sets on the root.
 * @returns The root with the part inside its item.
 */
export function itemed(children: ReactNode, props: RootProps = {}): ReactElement {
  return (
    <Root aria-label="Site" {...props}>
      <List>
        <Item value="products">
          <Trigger>Products</Trigger>
          {children}
        </Item>
      </List>
    </Root>
  );
}

/**
 * Moves a mouse onto an element and waits for the machine to take the move.
 *
 * @remarks
 *   The machine acts only on a mouse pointer, so the event states `pointerType`. React builds
 *   `onPointerEnter` from the bubbling `pointerover`.
 * @param element - The element the pointer arrives on.
 * @param pointerType - The kind of pointer, a mouse unless the case states another.
 */
export async function pointed(element: Element, pointerType = "mouse"): Promise<void> {
  fireEvent.pointerOver(element, { pointerType });
  await settled();
}

/**
 * Moves a mouse off an element and waits for the machine to take the move.
 *
 * @param element - The element the pointer leaves.
 * @param pointerType - The kind of pointer, a mouse unless the case states another.
 */
export async function left(element: Element, pointerType = "mouse"): Promise<void> {
  fireEvent.pointerOut(element, { pointerType });
  await settled();
}

/**
 * Waits inside `act` for a delay the machine started to run out.
 *
 * @param ms - The time to wait, longer than the machine's delay.
 */
export async function elapsed(ms = 20): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  });
}

/**
 * Replaces `ResizeObserver` with a stub whose callbacks a case runs by hand, as a change of size
 * runs them.
 *
 * @remarks
 *   The machine observes the document, the open trigger and the open panel, each through an
 *   observer of its own, so the stub keeps every callback. The shared test preset unstubs globals
 *   after every case.
 * @returns The function that runs every callback.
 */
export function observed(): () => void {
  const held = { callbacks: new Array<() => void>(), watched: 0 };

  /**
   * Replaces `ResizeObserver`, keeping its callback.
   */
  class Stub {
    /**
     * Keeps the callback the observer runs on a change of size.
     *
     * @param callback - The callback.
     */
    constructor(callback: () => void) {
      held.callbacks.push(callback);
    }

    /**
     * Counts an element the observer watches.
     */
    observe(): void {
      held.watched += 1;
    }

    /**
     * Counts an element the observer stops watching.
     */
    unobserve(): void {
      held.watched -= 1;
    }
  }

  vi.stubGlobal("ResizeObserver", Stub);

  return () => {
    for (const callback of held.callbacks) callback();
  };
}

/**
 * Waits inside `act` for the next animation frame, in which the machine moves focus and the
 * presence reads a closed panel's animation.
 */
export async function framed(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
  });
}
