/**
 * Fixtures for the pagination specs: a root of 24 pages around every part, and a stub of
 * `ResizeObserver` that a case triggers by hand.
 */

import { type ReactElement } from "react";

import { vi } from "vitest";

import { FirstTrigger } from "#pagination/first-trigger.tsx";
import { Items, type ItemsProps } from "#pagination/items.tsx";
import { LastTrigger } from "#pagination/last-trigger.tsx";
import { NextTrigger } from "#pagination/next-trigger.tsx";
import { PageText } from "#pagination/page-text.tsx";
import { PrevTrigger } from "#pagination/prev-trigger.tsx";
import { Root, type RootProps } from "#pagination/root.tsx";

/**
 * Returns the address of a page in the link cases: a fragment, so a press moves no document.
 *
 * @param details - The page the address opens.
 * @returns The fragment of the page.
 */
export function address({ page }: { readonly page: number }): string {
  return `#page-${page}`;
}

/**
 * Renders a root of 240 items in pages of ten on page 12, with the triggers around the pages and
 * the page text, and the props the case sets on the root and the items.
 *
 * @param props - The props the case sets on the root.
 * @param items - The props the case sets on the items.
 * @returns The root with every part.
 */
export function composed(props: RootProps = {}, items: ItemsProps = {}): ReactElement {
  return (
    <Root count={240} defaultPage={12} pageSize={10} {...props}>
      <FirstTrigger />
      <PrevTrigger />
      <Items {...items} />
      <NextTrigger />
      <LastTrigger />
      <PageText />
    </Root>
  );
}

/**
 * Replaces `ResizeObserver` with a stub whose callback a case runs by hand.
 *
 * @remarks
 *   The shared test preset unstubs globals after every case.
 * @returns The function that runs the callback, as a change of size does.
 */
export function observer(): () => void {
  const held = { callback: (): void => undefined, observing: false };

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
      held.callback = callback;
    }

    /**
     * Records that the observer stopped.
     */
    disconnect(): void {
      held.observing = false;
    }

    /**
     * Accepts an element, as the real observer does.
     */
    observe(): void {
      held.observing = true;
    }
  }

  vi.stubGlobal("ResizeObserver", Stub);

  return () => {
    held.callback();
  };
}
