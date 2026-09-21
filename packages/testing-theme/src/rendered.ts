/**
 * Reads the classes a rendered component applied from its recipe.
 *
 * @remarks
 *   A bound component marks the element its recipe applies to with `data-recipe`. A part of a
 *   compound component carries the slot class the binding writes and the pruning keeps,
 *   `card__header`, and a part an anatomy stamps also carries `data-part`, the slot's name in
 *   hyphens. The readers here select on one of those two. Each one throws where the element it was
 *   asked for is absent, naming it, so a failing specification reports which element is missing.
 */

import { slotClass } from "@stealthscale/pandacss-naming";

/**
 * Attribute a bound component marks the element its recipe applies to with.
 */
const RECIPE = "data-recipe";

/**
 * Attribute an anatomy marks each part of a compound component with.
 */
const PART = "data-part";

/**
 * Converts a slot's name to the hyphenated form an anatomy stamps a part with, so `itemIndicator`
 * selects the part stamped `item-indicator`.
 */
function partOf(slot: string): string {
  return slot
    .replaceAll(/([A-Z])([A-Z])/gu, "$1-$2")
    .replaceAll(/([a-z])([A-Z])/gu, "$1-$2")
    .replaceAll(/[\s_]+/gu, "-")
    .toLowerCase();
}

/**
 * Returns the first element in the rendered output matching a selector.
 *
 * @throws {@link Error} When nothing in the output matches the selector.
 */
function one(container: ParentNode, selector: string): HTMLElement {
  const found = container.querySelector<HTMLElement>(selector);

  if (found === null) throw new Error(`Nothing in the rendered output carries ${selector}.`);

  return found;
}

/**
 * Returns the element a recipe was applied to, selected by the class name the binding stamps into
 * `data-recipe`.
 *
 * @throws {@link Error} When no element in the output declares that recipe.
 */
export function recipeElement(container: ParentNode, name: string): HTMLElement {
  return one(container, `[${RECIPE}="${name}"]`);
}

/**
 * Returns the element one slot of a compound component was applied to, selected by the part its
 * anatomy stamps or by the slot class its binding writes.
 *
 * @remarks
 *   The slot class begins with the recipe's class name, so the caller passes that name and the
 *   slot as the recipe declares them and the reader builds `card__header` from the two.
 * @throws {@link Error} When no element in the output has that part or that slot class.
 */
export function slotElement(container: ParentNode, name: string, slot: string): HTMLElement {
  return one(container, `[${PART}="${partOf(slot)}"], .${slotClass(name, slot)}`);
}

/**
 * Returns every class on an element, sorted, so a comparison does not depend on the order the
 * compiler emitted them in.
 */
export function classesOf(element: Element): readonly string[] {
  return [...element.classList].toSorted();
}

/**
 * Returns every class on the element a recipe applies to, sorted.
 *
 * @throws {@link Error} When no element in the output declares that recipe.
 */
export function recipeClasses(container: ParentNode, name: string): readonly string[] {
  return classesOf(recipeElement(container, name));
}

/**
 * Returns every class on one slot of a compound component, sorted, with the slot selected as
 * {@link slotElement} selects it.
 *
 * @throws {@link Error} When no element in the output has that part or that slot class.
 */
export function slotClasses(container: ParentNode, name: string, slot: string): readonly string[] {
  return classesOf(slotElement(container, name, slot));
}
