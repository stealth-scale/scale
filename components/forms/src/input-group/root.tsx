/**
 * Renders the input group's box.
 *
 * @remarks
 *   The element is a `div` with no role, and every field in it carries its own name. Fields that
 *   need a shared name, such as a card number with its expiry and security code, sit in a
 *   `Fieldset.Root` with a legend. The root stays a `div`, because forced colors in Firefox paint
 *   a `fieldset`'s edge in a near-white gray whatever the author sets. A disabled `fieldset` around
 *   the group disables every field in it. The root
 *   lays its items out in one row, or stacks the `Row` parts it contains. The root provides the
 *   variants every part reads. A primary press on a mark, an addon's text or the padding of the box
 *   or a row focuses an enabled field. The field is the one nearest the pointer in the smallest
 *   part around the press that holds a field: the addon, the row or the box. Of two fields at the
 *   same distance, the later one is focused. A press that focuses a `select` also opens its list
 *   where the browser supports `showPicker`. A press on a control, a link or a label keeps its own
 *   behaviour.
 */

import { type ComponentProps, type MouseEvent, type ReactElement } from "react";

import { withProvider } from "#input-group/context.ts";

/**
 * Renders the root `div` with the recipe's variants.
 */
const Box = withProvider("div", "root");

/**
 * Selects the fields a press can focus.
 */
const FIELDS = ":is(input, select, textarea):not(:disabled)";

/**
 * Selects an element that handles a press itself.
 */
const INTERACTIVE = "a[href], button, input, label, select, textarea, [tabindex]";

/**
 * Describes the props of the input group's root: the recipe's variants and the props of a `div`.
 */
export type RootProps = ComponentProps<typeof Box>;

/**
 * Returns the distance from a point to the nearest edge of a field's box, or zero inside it.
 */
function distance(field: HTMLElement, x: number, y: number): number {
  const box = field.getBoundingClientRect();

  return Math.hypot(
    Math.max(box.left - x, 0, x - box.right),
    Math.max(box.top - y, 0, y - box.bottom),
  );
}

/**
 * Returns the enabled field nearest the point, in the smallest element around the pressed one that
 * holds an enabled field, or nothing when that element is not inside the box.
 */
function nearest(
  box: HTMLElement,
  pressed: Element,
  x: number,
  y: number,
): HTMLElement | undefined {
  const scope = pressed.closest(`:has(${FIELDS})`);

  if (scope === null || !box.contains(scope)) return undefined;

  return [...scope.querySelectorAll<HTMLElement>(FIELDS)].reduce((best, field) =>
    distance(field, x, y) <= distance(best, x, y) ? field : best,
  );
}

/**
 * Opens a select's list where the browser supports it. A browser that refuses throws, and the
 * select keeps its focus.
 */
function opened(field: HTMLElement): void {
  if (!(field instanceof HTMLSelectElement)) return;

  try {
    field.showPicker();
  } catch {
    field.focus();
  }
}

/**
 * Focuses the nearest field when a primary press lands outside every interactive element.
 */
function focusNearest(event: MouseEvent<HTMLDivElement>): void {
  const box = event.currentTarget;
  const pressed = event.target;

  if (event.defaultPrevented || event.button !== 0 || !(pressed instanceof Element)) return;

  const handled = pressed.closest(INTERACTIVE);

  if (handled !== null && box.contains(handled)) return;

  const field = nearest(box, pressed, event.clientX, event.clientY);

  if (field === undefined) return;

  event.preventDefault();
  field.focus();
  opened(field);
}

/**
 * Renders the box and moves a press on its non-interactive parts to the nearest field.
 */
export function Root({ onMouseDown, ...props }: RootProps): ReactElement {
  return (
    <Box
      {...props}
      onMouseDown={(event) => {
        onMouseDown?.(event);
        focusNearest(event);
      }}
    />
  );
}
