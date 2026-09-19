/**
 * Reads the tokens a theme has in force: every custom property the stylesheets declare, with
 * the value the root resolves it to under the theme and the colour mode the page wears.
 */

import { type Page } from "playwright";

/**
 * Reads every custom property declared in the page's stylesheets, with its value on the root.
 *
 * @remarks
 *   The names come from the stylesheets rather than from the computed style, because a browser
 *   does not list custom properties among the computed ones. A sheet from another origin cannot
 *   be read and is passed over.
 * @param page - The open page.
 * @returns The properties by name, sorted, without those that resolve to nothing.
 */
export function tokened(page: Page): Promise<Readonly<Record<string, string>>> {
  return page.evaluate(() => {
    const names = new Set<string>();

    /**
     * Collects the custom properties a list of rules declares, descending into groups.
     */
    const walk = (rules: CSSRuleList): void => {
      for (const rule of rules) {
        if (rule instanceof CSSStyleRule) {
          for (const name of rule.style) {
            if (name.startsWith("--")) names.add(name);
          }
        }

        if (rule instanceof CSSGroupingRule) walk(rule.cssRules);
      }
    };

    for (const sheet of document.styleSheets) {
      try {
        walk(sheet.cssRules);
      } catch {
        continue;
      }
    }

    const computed = getComputedStyle(document.documentElement);
    const tokens: Record<string, string> = {};

    for (const name of [...names].toSorted()) {
      const value = computed.getPropertyValue(name).trim();

      if (value !== "") tokens[name] = value;
    }

    return tokens;
  });
}
