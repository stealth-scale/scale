/**
 * Reads the outline of a region: its headings, landmarks, controls, recipes and untranslated keys.
 */

import { type Locator } from "playwright";

/**
 * Describes the outline of a region.
 */
export interface Outline {
  /**
   * Every control with its role and accessible name, with a count where several match.
   */
  readonly controls: readonly string[];

  /**
   * Console errors the page logged while loading.
   */
  readonly errors: readonly string[];

  /**
   * Every heading with its level.
   */
  readonly headings: readonly string[];

  /**
   * Every landmark with its name, where it has one.
   */
  readonly landmarks: readonly string[];

  /**
   * Text rendered as an untranslated key.
   */
  readonly raw: readonly string[];

  /**
   * Element count per recipe.
   */
  readonly recipes: Readonly<Record<string, number>>;

  /**
   * Scene titles on the page.
   */
  readonly scenes: readonly string[];
}

/**
 * Reads the outline of the first element a locator matches.
 *
 * @remarks
 *   The reading runs inside the browser, so every helper it calls is declared inside the callback.
 *   A key is lowercase words joined by dots. A file name such as `send.tsx`, a host name such as
 *   `ledger.internal` and a token name such as `bg.inverted` have the same shape. Text that ends in
 *   a common file extension or in a top-level domain reserved for examples and private networks,
 *   and text anywhere inside a `code` element, are not reported as keys, because a scene's words
 *   render a token name as code.
 */
export function outlined(root: Locator): Promise<Omit<Outline, "errors" | "scenes">> {
  return root.first().evaluate((element) => {
    const KEY = /^[a-z][a-z-]*(?:\.[a-z][a-z-]*)+$/u;
    const FILE =
      /\.(?:[cm]?[jt]sx?|json|csv|css|md|mdx|ya?ml|sh|html|svg|png|jpe?g|webp|pdf|log|txt|toml|xlsx|mov)$/u;
    const HOST = /\.(?:example|internal|invalid|local|localhost|test)$/u;
    const LANDMARK = /^(?:nav|main|aside|section|form)$/u;
    const CONTROLS =
      "a[href], button, input, select, textarea, [role=menuitem], [role=menuitemradio], [role=menuitemcheckbox], [role=option], [role=tab], [role=switch], [role=checkbox]";

    /**
     * Returns an element's trimmed text, or an empty string for no element.
     */
    // eslint-disable-next-line unicorn/consistent-function-scoping -- the function runs inside the browser, where only what is written inside the callback exists
    const textOf = (one: Element | null): string => one?.textContent?.trim() ?? "";

    /**
     * Returns an element's accessible name from `aria-label` or `aria-labelledby`.
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
     * Returns an element's role, or its tag when it has no role attribute.
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

    const raw = [...element.querySelectorAll(":not(code, code *)")]
      .map((one) => (one.children.length === 0 ? textOf(one) : ""))
      .filter((text) => KEY.test(text) && !FILE.test(text) && !HOST.test(text));

    return { controls, headings, landmarks, raw, recipes };
  });
}
