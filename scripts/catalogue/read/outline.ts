/**
 * Reads the outline of a region: what a reader or a screen reader meets on it.
 */

import { type Locator } from "playwright";

/**
 * Describes what the outline reports.
 */
export interface Outline {
  /**
   * Every control a reader can act on: its role and its accessible name, with a count where
   * several read alike.
   */
  readonly controls: readonly string[];

  /**
   * The errors the console reported while the page loaded.
   */
  readonly errors: readonly string[];

  /**
   * Every heading, with its level.
   */
  readonly headings: readonly string[];

  /**
   * Every landmark, with its name where it has one.
   */
  readonly landmarks: readonly string[];

  /**
   * Any text left as the key it was looked up by.
   */
  readonly raw: readonly string[];

  /**
   * A count of elements per recipe.
   */
  readonly recipes: Readonly<Record<string, number>>;

  /**
   * The titles of the scenes on the page.
   */
  readonly scenes: readonly string[];
}

/**
 * Reads the outline of the first element a locator finds.
 *
 * @remarks
 *   The reading runs inside the browser, so everything it uses is written inside the callback.
 */
export function outlined(root: Locator): Promise<Omit<Outline, "errors" | "scenes">> {
  return root.first().evaluate((element) => {
    const KEY = /^[a-z][a-z-]*(?:\.[a-z][a-z-]*)+$/u;
    const LANDMARK = /^(?:nav|main|aside|section|form)$/u;
    const CONTROLS =
      "a[href], button, input, select, textarea, [role=menuitem], [role=menuitemradio], [role=menuitemcheckbox], [role=option], [role=tab], [role=switch], [role=checkbox]";

    /**
     * Reads an element's text, trimmed, or nothing for no element.
     */
    // eslint-disable-next-line unicorn/consistent-function-scoping -- the function runs inside the browser, where only what is written inside the callback exists
    const textOf = (one: Element | null): string => one?.textContent?.trim() ?? "";

    /**
     * Reads an element's accessible name from its label or what labels it.
     */
    const named = (one: Element): string => {
      const label = one.getAttribute("aria-label");

      if (label !== null) return label;

      return (one.getAttribute("aria-labelledby") ?? "")
        .split(" ")
        .filter((id) => id !== "")
        .map((id) => textOf(document.querySelector(`[id="${id}"]`)))
        .join(" ")
        .trim();
    };

    /**
     * Reads an element's role, or its tag where it states none.
     */
    // eslint-disable-next-line unicorn/consistent-function-scoping -- as above
    const roleOf = (one: Element): string => one.getAttribute("role") ?? one.tagName.toLowerCase();

    const headings = [...element.querySelectorAll("h1, h2, h3, h4, h5, h6")].map(
      (one) => `${one.tagName.toLowerCase()} ${textOf(one)}`,
    );
    const landmarks = [...element.querySelectorAll("nav, main, aside, section, form, [role]")]
      .filter(
        (one) => LANDMARK.test(one.tagName.toLowerCase()) || one.getAttribute("role") !== null,
      )
      .map((one) => {
        const name = named(one);

        return `${roleOf(one)}${name === "" ? "" : ` "${name}"`}`;
      });
    const counted = new Map<string, number>();

    for (const one of element.querySelectorAll(CONTROLS)) {
      const control = `${roleOf(one)} "${named(one) || textOf(one)}"`;

      counted.set(control, (counted.get(control) ?? 0) + 1);
    }

    const controls = [...counted].map(([control, count]) =>
      count === 1 ? control : `${control} ×${String(count)}`,
    );
    const recipes: Record<string, number> = {};

    for (const one of element.querySelectorAll<HTMLElement>("[data-recipe]")) {
      const recipe = one.dataset["recipe"] ?? "";

      recipes[recipe] = (recipes[recipe] ?? 0) + 1;
    }

    const raw = [...element.querySelectorAll("*")]
      .filter((one) => one.children.length === 0 && KEY.test(textOf(one)))
      .map((one) => textOf(one));

    return { controls, headings, landmarks, raw, recipes };
  });
}
