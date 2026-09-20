/**
 * Reads how an element is drawn: the style the browser computed for it, and the rules that
 * reached it in the cascade.
 */

import { type Locator, type Page } from "playwright";

/**
 * The properties that decide how an element looks, which a reading takes unless asked for all.
 */
const VISUAL = [
  "display",
  "position",
  "inline-size",
  "block-size",
  "min-inline-size",
  "padding-block-start",
  "padding-block-end",
  "padding-inline-start",
  "padding-inline-end",
  "margin-block-start",
  "margin-block-end",
  "margin-inline-start",
  "margin-inline-end",
  "gap",
  "align-items",
  "justify-content",
  "flex-direction",
  "grid-template-columns",
  "color",
  "background-color",
  "background-image",
  "border-block-start-width",
  "border-inline-start-width",
  "border-block-start-style",
  "border-block-start-color",
  "border-start-start-radius",
  "border-end-end-radius",
  "box-shadow",
  "outline-width",
  "outline-style",
  "outline-color",
  "outline-offset",
  "font-family",
  "font-size",
  "font-weight",
  "line-height",
  "letter-spacing",
  "text-decoration-line",
  "text-transform",
  "opacity",
  "transform",
  "transition-property",
  "transition-duration",
  "cursor",
];

/**
 * Describes the computed style of one element: the element under the empty name, then each
 * property under its own.
 */
export type Computed = Readonly<Record<string, string>>;

/**
 * Describes one rule that reached an element.
 */
export interface Rule {
  /**
   * The declarations, each as `name: value`.
   */
  readonly declarations: readonly string[];

  /**
   * The rule's source: the page's own stylesheets, the browser, or an inline style.
   */
  readonly origin: string;

  /**
   * The selector that matched.
   */
  readonly selector: string;
}

/**
 * Reads the computed style of every element a selector finds under a root.
 *
 * @param root - The region the selector is read within.
 * @param selector - Which elements.
 * @param all - Whether every property is read, or the visual ones.
 * @returns One record per element.
 */
export function styled(
  root: Locator,
  selector: string,
  all: boolean,
): Promise<readonly Computed[]> {
  return root.locator(selector).evaluateAll(
    (elements, options) =>
      elements.map((element) => {
        const computed = getComputedStyle(element);
        const names = options.all ? [...computed] : options.visual;
        const recipe = element.dataset["recipe"];
        const read: Record<string, string> = {
          "": `${element.tagName.toLowerCase()}${recipe === undefined ? "" : `[${recipe}]`}`,
        };

        for (const name of names) read[name] = computed.getPropertyValue(name);

        return read;
      }),
    { all, visual: VISUAL },
  );
}

/**
 * The attribute the element to read is marked with, so the devtools protocol can be pointed at it
 * from the document's root.
 */
const MARK = "data-catalogue-rules";

/**
 * Reads the rules that reach the first element a selector finds under a root, through the
 * browser's own devtools protocol, which only Chromium speaks.
 *
 * @param page - The open page.
 * @param root - The region the selector is read within.
 * @param selector - Which element.
 * @returns The rules, least specific first, and the inline style last where there is one.
 * @throws {@link Error} When the browser is not Chromium or nothing matches the selector.
 */
export async function ruled(page: Page, root: Locator, selector: string): Promise<readonly Rule[]> {
  if (page.context().browser()?.browserType().name() !== "chromium") {
    throw new Error("--rules reads the devtools protocol, which needs --browser chromium");
  }

  const element = root.locator(selector).first();

  if ((await element.count()) === 0) throw new Error(`nothing matches ${selector}`);

  await element.evaluate((one, mark) => {
    one.setAttribute(mark, "");
  }, MARK);

  const session = await page.context().newCDPSession(page);

  await session.send("DOM.enable");
  await session.send("CSS.enable");

  const document = await session.send("DOM.getDocument", { depth: -1 });
  const { nodeId } = await session.send("DOM.querySelector", {
    nodeId: document.root.nodeId,
    selector: `[${MARK}]`,
  });
  const matched = await session.send("CSS.getMatchedStylesForNode", { nodeId });

  await element.evaluate((one, mark) => {
    one.removeAttribute(mark);
  }, MARK);

  const rules: Rule[] = (matched.matchedCSSRules ?? []).map(({ rule }) => ({
    declarations: rule.style.cssProperties
      .filter((property) => property.disabled !== true && property.text !== undefined)
      .map((property) => `${property.name}: ${property.value}`),
    origin: rule.origin,
    selector: rule.selectorList.text,
  }));
  const inline = matched.inlineStyle;

  if (inline !== undefined && inline.cssProperties.length > 0) {
    rules.push({
      declarations: inline.cssProperties.map((property) => `${property.name}: ${property.value}`),
      origin: "inline",
      selector: "style=",
    });
  }

  await session.detach();

  return rules;
}
