/**
 * Renders the menubars the part specifications test, reads their names, presses them the way a
 * browser does, and stubs the observer that measures a row.
 */

import { type ReactElement } from "react";

import { act, fireEvent, screen, within } from "@testing-library/react";
import { vi } from "vitest";

import { Portal } from "@stealthscale/component-primitives";
import { settled } from "@stealthscale/testing-react";

import {
  Item,
  Content as MenuContent,
  Root as MenuRoot,
  Positioner,
  TriggerItem,
} from "#menu/index.ts";
import { Content, Menu, Root, type RootProps, Trigger } from "#menubar/index.ts";

/**
 * Renders a bar named Editor with the menus File, Edit and View, each panel portalled to the
 * document body. File's third row opens a submenu, and Edit's second row is disabled.
 *
 * @param props - The root's props.
 * @returns The bar.
 */
export function bar(props: Partial<RootProps> = {}): ReactElement {
  return (
    <Root aria-label="Editor" {...props}>
      <Menu value="file">
        <Trigger>File</Trigger>
        <Portal>
          <Content>
            <Item value="new">New</Item>
            <Item value="open">Open</Item>
            <MenuRoot>
              <TriggerItem>Share</TriggerItem>
              <Portal>
                <Positioner>
                  <MenuContent>
                    <Item value="link">Copy link</Item>
                  </MenuContent>
                </Positioner>
              </Portal>
            </MenuRoot>
          </Content>
        </Portal>
      </Menu>
      <Menu value="edit">
        <Trigger>Edit</Trigger>
        <Portal>
          <Content>
            <Item value="undo">Undo</Item>
            <Item disabled value="redo">
              Redo
            </Item>
          </Content>
        </Portal>
      </Menu>
      <Menu value="view">
        <Trigger>View</Trigger>
        <Portal>
          <Content>
            <Item value="zoom">Zoom</Item>
          </Content>
        </Portal>
      </Menu>
    </Root>
  );
}

/**
 * Returns the name of the bar that reads the words.
 *
 * @param words - The name's words.
 * @returns The name's element.
 */
export function named(words: string): HTMLElement {
  return within(screen.getByRole("menubar")).getByRole("menuitem", { name: words });
}

/**
 * Moves focus to the name that reads the words, which moves the bar's tab stop to it.
 *
 * @param words - The name's words.
 * @returns The name's element.
 */
export function focused(words: string): HTMLElement {
  const name = named(words);

  act(() => {
    name.focus();
  });

  return name;
}

/**
 * Returns `aria-expanded` of the name that reads the words.
 *
 * @param words - The name's words.
 * @returns The attribute's value.
 */
export function expanded(words: string): null | string {
  return named(words).getAttribute("aria-expanded");
}

/**
 * Presses an element with the three pointer events in one task, as a browser fires them within one
 * animation frame, and waits for the frames after it, in which a menu handles a press outside it.
 *
 * @param element - The element pressed.
 */
export async function clicked(element: Element): Promise<void> {
  await act(async () => {
    fireEvent.pointerDown(element);
    fireEvent.pointerUp(element);
    fireEvent.click(element);
    await Promise.resolve();
  });
  await act(async () => {
    await new Promise((resolve) => {
      setTimeout(resolve, 50);
    });
  });
}

/**
 * Presses a key on an element and waits for the machines to settle.
 *
 * @param element - The element with focus.
 * @param key - The key's `key` value.
 * @param init - The modifiers held.
 */
export async function keyed(
  element: Element,
  key: string,
  init: Readonly<Pick<KeyboardEventInit, "altKey" | "ctrlKey" | "metaKey">> = {},
): Promise<void> {
  fireEvent.keyDown(element, { key, ...init });
  await settled();
}

/**
 * Replaces `ResizeObserver` with a stub whose callbacks a case runs by hand.
 *
 * @remarks
 *   The shared test preset unstubs globals after every case.
 * @returns The function that runs the callback of every observer still observing, as a change of
 *   size does.
 */
export function observer(): () => void {
  const observing = new Set<() => void>();

  /**
   * Replaces `ResizeObserver`, keeping its callback while it observes.
   */
  class Stub {
    /**
     * Callback the observer runs on a change of size.
     */
    readonly callback: () => void;

    /**
     * Keeps the callback.
     *
     * @param callback - The callback.
     */
    constructor(callback: () => void) {
      this.callback = callback;
    }

    /**
     * Stops running the callback.
     */
    disconnect(): void {
      observing.delete(this.callback);
    }

    /**
     * Starts running the callback.
     */
    observe(): void {
      observing.add(this.callback);
    }
  }

  vi.stubGlobal("ResizeObserver", Stub);

  return () => {
    for (const callback of observing) callback();
  };
}
