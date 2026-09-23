/**
 * Finds layout faults on an open catalogue page: content wider than its box, and sibling rows whose
 * end marks are at different distances from the row's end.
 *
 * @remarks
 *   Both readings run inside the browser, so every helper they call is declared inside the
 *   callback. Both read every recipe slot on the page, which is any element with a `__` class,
 *   chrome included.
 */

import { type Page } from "playwright";

/**
 * Distance from a row's end to its last part.
 */
interface End {
  /**
   * Distance in CSS pixels, rounded to one decimal.
   */
  readonly gap: number;

  /**
   * Slot class of the last part.
   */
  readonly part: string;
}

/**
 * Lists every recipe slot whose content is wider than its box, as `slot content>box`.
 *
 * @remarks
 *   A slot that truncates with an ellipsis, scrolls, or is visually hidden is excluded, because
 *   each of those clips its own content by design. A visually hidden slot is at most 2px wide with
 *   `overflow: hidden` or `clip`, which is how `srOnly` renders. Only the slot's own style is read,
 *   because the catalogue scrolls `main` and every slot has a scrolling ancestor.
 * @param page - The open page.
 * @returns One entry per distinct slot and width pair, or an empty array.
 */
export function overflowing(page: Page): Promise<readonly string[]> {
  return page.evaluate(() => {
    /**
     * Returns the element's slot class, the class with `__` and without `--`.
     */
    // eslint-disable-next-line unicorn/consistent-function-scoping -- the function runs inside the browser, where only what is written inside the callback exists
    const slot = (element: Element): string =>
      [...element.classList].find((one) => one.includes("__") && !one.includes("--")) ?? "";

    /**
     * Returns true when the element clips its own content by design.
     */
    // eslint-disable-next-line unicorn/consistent-function-scoping -- the function runs inside the browser, where only what is written inside the callback exists
    const clipped = (element: Element): boolean => {
      const style = getComputedStyle(element);
      const hides = style.overflowX === "hidden" || style.overflowX === "clip";

      return (
        style.textOverflow === "ellipsis" ||
        style.overflowX === "auto" ||
        style.overflowX === "scroll" ||
        (hides && element.getBoundingClientRect().width <= 2)
      );
    };

    const found = [...document.querySelectorAll("[class*=__]")]
      .filter((element) => !clipped(element))
      .map((element) => ({
        box: Math.round(element.getBoundingClientRect().width),
        content: element.scrollWidth,
        slot: slot(element),
      }))
      .filter((each) => each.content > each.box + 1)
      .map((each) => `${each.slot} ${String(each.content)}>${String(each.box)}`);

    return [...new Set(found)];
  });
}

/**
 * Lists every set of sibling rows whose last parts end at different distances from the row's end.
 *
 * @remarks
 *   A set is two or more visible children of one slot that share a slot class and a width, so the
 *   rows of one list qualify and a run of captions or tags does not. A last part wider than 80% of
 *   its row is the row's body and is skipped. Distances within 1px of each other count as one
 *   column. The catalogue kit's own slots are skipped, because its captions differ in length by
 *   design.
 * @param page - The open page.
 * @returns One entry per set, as `parent > row: ends at a / b (parts)`, or an empty array.
 */
export function unaligned(page: Page): Promise<readonly string[]> {
  return page.evaluate(() => {
    const KIT = /^(?:matrix|sample|board|room|tile|section|text|heading|code-block)/u;

    /**
     * Returns the element's slot class, the class with `__` and without `--`.
     */
    // eslint-disable-next-line unicorn/consistent-function-scoping -- the function runs inside the browser, where only what is written inside the callback exists
    const slot = (element: Element): string =>
      [...element.classList].find((one) => one.includes("__") && !one.includes("--")) ?? "";

    /**
     * Returns true when the element's box is larger than 2px on both axes.
     */
    // eslint-disable-next-line unicorn/consistent-function-scoping -- as above
    const visible = (element: Element): boolean => {
      const box = element.getBoundingClientRect();

      return box.width > 2 && box.height > 2;
    };

    /**
     * Returns the distance from the row's end to its last part, or undefined for a row whose last
     * part is its body.
     */
    const endOf = (row: Element): End | undefined => {
      const last = [...row.children].findLast((child) => visible(child));
      const box = row.getBoundingClientRect();

      if (last === undefined || last.getBoundingClientRect().width > box.width * 0.8) {
        return undefined;
      }

      return {
        gap: Math.round((box.right - last.getBoundingClientRect().right) * 10) / 10,
        part: slot(last),
      };
    };

    const reports = new Set<string>();

    for (const parent of document.querySelectorAll("[class*=__]")) {
      const rows = [...parent.children].filter((child) => visible(child));
      const [first] = rows;
      const widths = new Set(rows.map((row) => Math.round(row.getBoundingClientRect().width)));

      if (KIT.test(slot(parent)) || first === undefined || slot(first) === "") continue;
      if (new Set(rows.map((row) => slot(row))).size !== 1 || widths.size !== 1) continue;

      const ends = rows.map((row) => endOf(row)).filter((end) => end !== undefined);
      const gaps = [...new Set(ends.map((end) => end.gap))];

      if (ends.length > 1 && Math.max(...gaps) - Math.min(...gaps) > 1) {
        const parts = [...new Set(ends.map((end) => end.part))].join(", ");

        reports.add(`${slot(parent)} > ${slot(first)}: ends at ${gaps.join(" / ")} (${parts})`);
      }
    }

    return [...reports];
  });
}
