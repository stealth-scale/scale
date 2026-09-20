/**
 * Reads the tree of elements a region holds, each with its recipe, its classes, its role, its
 * ARIA and state attributes and its own words.
 */

import { type Locator } from "playwright";

/**
 * Describes one element of the tree.
 */
export interface Drawn {
  /**
   * The element's ARIA attributes, its role and the state attributes it carries.
   */
  readonly attributes: Readonly<Record<string, string>>;

  /**
   * The elements inside it, to the depth asked for.
   */
  readonly children: readonly Drawn[];

  /**
   * Its classes: the recipe's slot and variant classes, or every class where asked.
   */
  readonly classes: readonly string[];

  /**
   * The recipe the element carries as `data-recipe`, where it carries one.
   */
  readonly recipe: string | undefined;

  /**
   * The element's tag, in lower case.
   */
  readonly tag: string;

  /**
   * The element's own text, whole, where it holds any directly.
   */
  readonly text: string;
}

/**
 * Reads the tree of the elements a locator finds, to a depth.
 *
 * @param root - The elements to start from.
 * @param depth - How many levels down to read.
 * @param every - Whether every class is kept, or only a recipe's slot and variant classes.
 * @returns One tree per element found.
 */
export function treed(root: Locator, depth: number, every: boolean): Promise<readonly Drawn[]> {
  return root.evaluateAll(
    (elements, options) => {
      const KEPT =
        /^(?:aria-.+|data-state|data-narrow|data-part|role|tabindex|hidden|inert|disabled|open|href|type|for|id|name|value)$/u;

      /**
       * Reads one element and what is under it.
       */
      const drawn = (element: Element, level: number): Drawn => {
        const attributes: Record<string, string> = {};

        for (const attribute of element.attributes) {
          if (KEPT.test(attribute.name)) attributes[attribute.name] = attribute.value;
        }

        const own = [...element.childNodes]
          .filter((child) => child.nodeType === Node.TEXT_NODE)
          .map((child) => child.textContent?.trim() ?? "")
          .join(" ")
          .trim();

        return {
          attributes,
          children:
            level >= options.depth
              ? []
              : [...element.children].map((child) => drawn(child, level + 1)),
          classes: [...element.classList].filter(
            (one) => options.every || one.includes("--") || one.includes("__"),
          ),
          recipe: element instanceof HTMLElement ? element.dataset["recipe"] : undefined,
          tag: element.tagName.toLowerCase(),
          text: own,
        };
      };

      return elements.map((element) => drawn(element, 1));
    },
    { depth, every },
  );
}

/**
 * Writes one node and what is under it as indented lines.
 *
 * @param node - The element to write.
 * @param level - How deep it sits, which is how far it is indented.
 * @param into - The lines written so far, which the node's are added to.
 */
export function lined(node: Drawn, level: number, into: string[]): void {
  const parts = [
    node.tag,
    node.recipe === undefined ? "" : `[${node.recipe}]`,
    node.classes.length === 0 ? "" : `.${node.classes.join(".")}`,
    ...Object.entries(node.attributes).map(([name, value]) => `${name}=${JSON.stringify(value)}`),
    node.text === "" ? "" : `"${node.text}"`,
  ];

  into.push(`${"  ".repeat(level)}${parts.filter((part) => part !== "").join(" ")}`);

  for (const child of node.children) lined(child, level + 1, into);
}
