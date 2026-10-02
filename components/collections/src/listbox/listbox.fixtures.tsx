/**
 * Builds the listboxes the part specifications render.
 */

import { type ReactElement, type ReactNode } from "react";

import { vi } from "vitest";

import { Content } from "#listbox/content.tsx";
import { Input } from "#listbox/input.tsx";
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
 * Lays every element out 100 pixels square around content four times as tall, or as tall when the
 * content fits, and reports every element an observer watches as in view at once, so a scroll area
 * measures.
 *
 * @remarks
 *   Happy-dom lays out nothing and never reports an intersection. The shared test preset restores
 *   the spies and unstubs the globals after every case.
 * @param overflows - Whether the content is taller than the element around it.
 */
export function overflowing(overflows = true): void {
  const watched: Element[] = [];

  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(100);
  vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(100);
  vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(100);
  vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(overflows ? 400 : 100);

  /**
   * Replaces `IntersectionObserver` with an observer that reports each element in view.
   */
  class Stub {
    /**
     * Callback the observer runs for each element it watches.
     */
    readonly #callback: IntersectionObserverCallback;

    /**
     * Keeps the callback.
     *
     * @param callback - The callback.
     */
    constructor(callback: IntersectionObserverCallback) {
      this.#callback = callback;
    }

    /**
     * Forgets the watched elements, as the real observer does.
     */
    disconnect(): void {
      watched.length = 0;
    }

    /**
     * Watches the element and reports it in view.
     *
     * @param target - The element.
     */
    observe(target: Element): void {
      const entries = [{ intersectionRatio: 1, target }];

      watched.push(target);
      // eslint-disable-next-line typescript/no-unsafe-type-assertion -- the machine reads intersectionRatio, which each entry contains
      this.#callback(entries as unknown as IntersectionObserverEntry[], {} as IntersectionObserver);
    }
  }

  vi.stubGlobal("IntersectionObserver", Stub);
}

/**
 * Renders a listbox with a label and the three rows, each with its text and mark.
 *
 * @param props - The props of the root.
 * @param field - Whether a filter field renders above the rows.
 * @returns The listbox.
 */
export function composed(props: Omit<RootProps, "collection"> = {}, field = false): ReactElement {
  return (
    <Root collection={COLLECTION} {...props}>
      <Label>Places</Label>
      {field ? <Input aria-label="Filter places" /> : null}
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
