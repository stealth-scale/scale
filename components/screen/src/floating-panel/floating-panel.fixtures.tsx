/**
 * Fixtures for the floating panel specs: a whole panel with every part, an open panel around a
 * part, the panel and the place the machine wrote for it, and a key pressed on an element.
 */

import { type ReactElement, type ReactNode } from "react";

import { act, fireEvent, screen } from "@testing-library/react";
import { vi } from "vitest";

import { settled } from "@stealthscale/testing-react";

import {
  Body,
  CloseTrigger,
  Content,
  type ContentProps,
  Control,
  DragTrigger,
  Header,
  Positioner,
  ResizeTriggers,
  Root,
  type RootProps,
  StageTrigger,
  Title,
  Trigger,
} from "#floating-panel/index.ts";

/**
 * Renders a trigger and a panel with a header, three stage triggers, a close trigger, a body with
 * a field and every resize trigger, followed by a button outside the root.
 *
 * @param props - The props the case sets on the root.
 * @param content - The props the case sets on the panel.
 * @returns The trigger, the panel and the button after them.
 */
export function composed(props: RootProps = {}, content: ContentProps = {}): ReactElement {
  return (
    <>
      <Root {...props}>
        <Trigger>Notes</Trigger>
        <Positioner>
          <Content {...content}>
            <Header>
              <DragTrigger>
                <Title>Launch notes</Title>
              </DragTrigger>
              <Control>
                <StageTrigger stage="minimized">_</StageTrigger>
                <StageTrigger stage="maximized">+</StageTrigger>
                <StageTrigger stage="default">=</StageTrigger>
                <CloseTrigger>x</CloseTrigger>
              </Control>
            </Header>
            <Body>
              <input aria-label="Note" />
            </Body>
            <ResizeTriggers />
          </Content>
        </Positioner>
      </Root>
      <button type="button">After</button>
    </>
  );
}

/**
 * Renders a part inside the panel of an open root.
 *
 * @param children - The part under test.
 * @param props - The props the case sets on the root.
 * @returns The root with the part inside its panel.
 */
export function opened(children: ReactNode, props: RootProps = {}): ReactElement {
  return (
    <Root defaultOpen {...props}>
      <Positioner>
        <Content aria-label="Panel">{children}</Content>
      </Positioner>
    </Root>
  );
}

/**
 * Returns the panel.
 */
export function panel(): HTMLElement {
  return screen.getByRole("dialog");
}

/**
 * Describes the place and the size the machine wrote on the positioner, in pixels.
 */
export interface Placed {
  /**
   * Height of the panel.
   */
  readonly height: number;

  /**
   * Width of the panel.
   */
  readonly width: number;

  /**
   * Distance of the panel from the window's left edge.
   */
  readonly x: number;

  /**
   * Distance of the panel from the window's top edge.
   */
  readonly y: number;
}

/**
 * Returns the place and the size the machine wrote on the panel's positioner.
 */
export function placed(): Placed {
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the positioner is the panel's parent
  const { style } = panel().parentElement as HTMLElement;
  const read = (name: string): number => Number(style.getPropertyValue(name).replace("px", ""));

  return { height: read("--height"), width: read("--width"), x: read("--x"), y: read("--y") };
}

/**
 * Presses a key on an element and waits for the machine.
 *
 * @param element - The element with focus.
 * @param init - The key and its modifiers.
 * @returns Whether the key's default action still runs, false once a handler cancelled it.
 */
export async function keyed(
  element: HTMLElement,
  init: KeyboardEventInit & Record<"key", string>,
): Promise<boolean> {
  const kept = fireEvent.keyDown(element, init);

  await settled();

  return kept;
}

/**
 * Waits for the next animation frame, in which the machine focuses the panel and the Tab proxy
 * starts.
 */
export async function frame(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
    await Promise.resolve();
  });
}

/**
 * Reproduces Chromium, which blurs a focused button in the write that hides it and refuses to
 * focus a hidden one. The spies are restored after the case.
 */
export function blurredOnHide(): void {
  vi.spyOn(HTMLButtonElement.prototype, "setAttribute").mockImplementation(function hide(
    this: HTMLButtonElement,
    name: string,
    value: string,
  ) {
    Element.prototype.setAttribute.call(this, name, value);

    if (name === "hidden" && this === document.activeElement) this.blur();
  });
  vi.spyOn(HTMLButtonElement.prototype, "focus").mockImplementation(function focus(
    this: HTMLButtonElement,
    options?: FocusOptions,
  ) {
    if (this.hidden === false) HTMLElement.prototype.focus.call(this, options);
  });
}
