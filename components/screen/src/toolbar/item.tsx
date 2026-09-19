/**
 * Draws one control in the row, holding the single tab stop the arrows move.
 *
 * @remarks
 *   A toolbar has one tab stop and the arrows move it, which is what `role="toolbar"` promises a
 *   screen reader. The roving focus group puts that stop on the item's own element, so the control
 *   has to be the item rather than sit inside one: a button nested in an item carries a second stop
 *   and the row then has two for one control.
 *   A control draws a `button` and states `type="button"`, so one inside a form does not submit it.
 *   Passing `href` draws an `a` instead, for a control that goes somewhere. Passing `as` draws the
 *   component named, with the stop on the element it renders: the library's button, a router's
 *   link, or the control that opens a menu, each taking its own props beside the item's.
 *   `Action` and `Folded` are bound around this and read `as` for themselves, so a control drawn
 *   through either keeps the element this decides.
 */

import { type ComponentProps, type ElementType, type ReactElement } from "react";

import { RovingFocus } from "@stealthscale/component-a11y";

/**
 * Describes what the roving focus group takes from an item, less the element it draws.
 */
type Roving = Omit<ComponentProps<typeof RovingFocus.Item>, "as" | "ref">;

/**
 * Describes what a control in the row takes: the item's own props, and those of whatever it is
 * drawn as.
 *
 * @typeParam Drawn - The element or the component the control is drawn as.
 */
export type ItemProps<Drawn extends ElementType = "button"> = {
  /**
   * The element or the component the control is drawn as. A button, or a link where `href` is
   * given.
   */
  readonly as?: Drawn | undefined;

  /**
   * Where the control goes, which draws it as a link rather than a button.
   */
  readonly href?: string | undefined;
} & Omit<ComponentProps<Drawn>, keyof Roving> &
  Roving;

/**
 * Acts on what the toolbar sits above, and takes the row's tab stop while it holds it.
 *
 * @param props - The element or the component it is drawn as, where it goes for a link, and
 *   everything an item takes.
 * @returns The control, carrying the row's tab stop.
 */
export function Item<Drawn extends ElementType = "button">({
  as,
  href,
  ...rest
}: ItemProps<Drawn>): ReactElement {
  const control =
    as === undefined
      ? href === undefined
        ? { as: "button", type: "button", ...rest }
        : { as: "a", href, ...rest }
      : { as, href, ...rest };

  // The element and its own attributes are decided together above. A bound component types its
  // props as the element it was bound to whatever it renders, so the pair cannot be handed over as
  // one without saying so here.
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
  return <RovingFocus.Item {...(control as ComponentProps<typeof RovingFocus.Item>)} />;
}
