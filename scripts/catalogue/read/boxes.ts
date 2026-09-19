/**
 * Reads where elements sit on the page and how big they are.
 */

import { type Locator } from "playwright";

/**
 * Describes the box of one element, in CSS pixels from the page's top left corner.
 */
export interface Box {
  /**
   * Its height.
   */
  readonly height: number;

  /**
   * The element, as its tag and its recipe.
   */
  readonly named: string;

  /**
   * Its width.
   */
  readonly width: number;

  /**
   * Its left edge.
   */
  readonly x: number;

  /**
   * Its top edge.
   */
  readonly y: number;
}

/**
 * Reads the box of every element a selector finds under a root.
 *
 * @param root - The region the selector is read within.
 * @param selector - Which elements.
 * @returns One box per element, in document order.
 */
export function boxed(root: Locator, selector: string): Promise<readonly Box[]> {
  return root.locator(selector).evaluateAll((elements) =>
    elements.map((element) => {
      const box = element.getBoundingClientRect();
      const recipe = element.dataset["recipe"];

      /**
       * Rounds a length to two decimals.
       */
      // eslint-disable-next-line unicorn/consistent-function-scoping -- the function runs inside the browser, where only what is written inside the callback exists
      const rounded = (length: number): number => Math.round(length * 100) / 100;

      return {
        height: rounded(box.height),
        named: `${element.tagName.toLowerCase()}${recipe === undefined ? "" : `[${recipe}]`}`,
        width: rounded(box.width),
        x: rounded(box.x + window.scrollX),
        y: rounded(box.y + window.scrollY),
      };
    }),
  );
}
