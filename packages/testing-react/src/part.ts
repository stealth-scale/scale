/**
 * Finds the elements a component rendered by the part name each one has.
 *
 * @remarks
 *   A specification finds a component's elements by their `data-part`. The readers return an
 *   element unchanged, and other modules read what the element contains.
 */

/**
 * The attribute a component marks each piece of its anatomy with.
 */
const PART = "data-part";

/**
 * Describes an element a component rendered, HTML or SVG.
 *
 * @remarks
 *   The type includes `style`, so a reader can read a custom property off an element. A count
 *   computed at run time cannot be a class name, so a component writes it into the style attribute
 *   as a custom property, and the recipe reads it there.
 */
export type Rendered = Element & ElementCSSInlineStyle & HTMLOrSVGElement;

/**
 * Builds the attribute selector that matches one named part.
 */
function selector(name: string): string {
  return `[${PART}="${name}"]`;
}

/**
 * Returns the first element a component marked with a part name.
 *
 * @remarks
 *   A component that renders the same part once per item has several matches, and the first in
 *   document order is the one returned. A caller that wants all of them reads {@link parts}.
 * @throws {@link Error} When nothing under the container has that part name.
 */
export function part(container: ParentNode, name: string): Rendered {
  const found = container.querySelector<HTMLElement | SVGElement>(selector(name));

  if (found === null) throw new Error(`Nothing in the rendered output matches ${selector(name)}.`);

  return found;
}

/**
 * Lists every element a component marked with a part name, in document order.
 *
 * @remarks
 *   A name no element has returns an empty array instead of throwing, so a specification can
 *   assert that a component rendered none of a part. The result is a plain array, not a live
 *   NodeList, so a later render does not change it.
 */
export function parts(container: ParentNode, name: string): readonly Rendered[] {
  return [...container.querySelectorAll<HTMLElement | SVGElement>(selector(name))];
}

/**
 * Returns the one element a render put at the top of its container.
 *
 * @remarks
 *   A component under check renders a single root, and this reader finds it without any
 *   `data-part`. A render that produces several top-level elements returns the first.
 * @throws {@link Error} When the render produced no element at all.
 * @throws {@link Error} When the first element is neither HTML nor SVG, such as a MathML one.
 */
export function only(container: ParentNode): Rendered {
  const found = container.firstElementChild;

  if (found === null) throw new Error("The render produced no element.");

  if (!(found instanceof HTMLElement) && !(found instanceof SVGElement)) {
    throw new Error(
      `The render produced <${found.tagName.toLowerCase()}>, which is neither HTML nor SVG.`,
    );
  }

  return found;
}
