/**
 * Fixtures for the marquee specs: a whole marquee with every part, its root and copies, and the
 * sizes the machine measures.
 */

import { type ReactElement } from "react";

import { act, screen } from "@testing-library/react";
import { vi } from "vitest";

import {
  Content,
  type ContentProps,
  Edge,
  Item,
  PauseIndicator,
  PauseTrigger,
  Root,
  type RootProps,
  Viewport,
} from "#marquee/index.ts";

/**
 * Describes the props a case sets on the fixture's root: every root prop but the name, which the
 * fixture sets.
 */
export type Staged = Omit<RootProps, "aria-label" | "aria-labelledby">;

/**
 * Renders a marquee named "Customers" with three items, both edges and the pause control.
 *
 * @param props - The props the case sets on the root.
 * @param content - The props the case sets on the copies.
 * @returns The marquee.
 */
export function composed(props: Staged = {}, content: ContentProps = {}): ReactElement {
  return (
    <Root aria-label="Customers" {...props}>
      <Viewport>
        <Content {...content}>
          <Item>Acme</Item>
          <Item>Globex</Item>
          <Item>Initech</Item>
        </Content>
      </Viewport>
      <Edge side="start" />
      <Edge side="end" />
      <PauseTrigger>
        <PauseIndicator pause="pause glyph" play="play glyph" />
      </PauseTrigger>
    </Root>
  );
}

/**
 * Returns the marquee's root, the named region.
 */
export function region(): HTMLElement {
  return screen.getByRole("region", { name: "Customers" });
}

/**
 * Returns every copy of the items, the first one and its clones.
 */
export function copies(): HTMLElement[] {
  return [...region().querySelectorAll<HTMLElement>('[data-part="content"]')];
}

/**
 * Gives the root and every copy the sizes the machine measures along its axis.
 *
 * @remarks
 *   The defaults make the root 800 pixels wide and a copy 200, so `autoFill` asks for three more
 *   copies. A second call replaces the sizes of the first.
 * @param root - Size of the root, in pixels.
 * @param copy - Size of a copy, in pixels.
 * @param axis - The size the machine reads: the width across, the height down.
 */
export function measured(
  root = 800,
  copy = 200,
  axis: "clientHeight" | "clientWidth" = "clientWidth",
): void {
  vi.spyOn(HTMLElement.prototype, axis, "get").mockImplementation(function size(this: HTMLElement) {
    return this.dataset["part"] === "root" ? root : copy;
  });
}

/**
 * Replaces `ResizeObserver` with a stub that keeps each callback.
 *
 * @remarks
 *   The shared test preset unstubs globals after every case.
 * @returns The function that runs every callback inside `act`, as a change of size does.
 */
export function resized(): () => void {
  const callbacks = new Set<() => void>();

  /**
   * Replaces `ResizeObserver`, keeping its callback while it observes an element.
   */
  class Stub {
    /**
     * Callback the observer runs on a change of size.
     */
    readonly #callback: () => void;

    /**
     * Keeps the callback.
     *
     * @param callback - The callback.
     */
    constructor(callback: () => void) {
      this.#callback = callback;
    }

    /**
     * Drops the callback, as a disconnected observer runs it no more.
     */
    disconnect(): void {
      callbacks.delete(this.#callback);
    }

    /**
     * Keeps the callback for the case to run.
     */
    observe(): void {
      callbacks.add(this.#callback);
    }
  }

  vi.stubGlobal("ResizeObserver", Stub);

  return () => {
    act(() => {
      for (const callback of callbacks) callback();
    });
  };
}
