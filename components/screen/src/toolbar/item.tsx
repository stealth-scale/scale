/**
 * Renders one control in the row, with the row's roving tab stop.
 *
 * @remarks
 *   The roving focus group puts the tab stop on the item's own element, so the control is the item
 *   and not a child of one: a button inside an item would add a second tab stop. The item renders
 *   a `button` with `type="button"`, an `a` when `href` is set, or the component passed as `as`
 *   with the tab stop on its element, such as the library's button, a router's link or a menu's
 *   trigger. `Action` renders the library's button through it.
 */

import { type ComponentProps, type ElementType, type ReactElement } from "react";

import { RovingFocus } from "@stealthscale/component-a11y";

/**
 * Describes the roving focus item's props without the element it renders.
 */
type Roving = Omit<ComponentProps<typeof RovingFocus.Item>, "as" | "ref">;

/**
 * Describes the props of a control: the item's props and the props of the element or component it
 * renders as.
 *
 * @typeParam Drawn - The element or component the control renders as.
 */
export type ItemProps<Drawn extends ElementType = "button"> = {
  /**
   * The element or component the control renders as: a `button`, or an `a` when `href` is set.
   */
  readonly as?: Drawn | undefined;

  /**
   * The link's target, which renders the control as an `a`.
   */
  readonly href?: string | undefined;
} & Omit<ComponentProps<Drawn>, keyof Roving> &
  Roving;

/**
 * Renders the control as a roving focus item.
 *
 * @param props - The element or component it renders as, the link's target and the item's props.
 * @returns The control element.
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

  // The element and its attributes are chosen together above. A bound component types its props as
  // the element it was bound to, whatever it renders, so the pair needs this assertion.
  // eslint-disable-next-line typescript/no-unsafe-type-assertion -- see above
  return <RovingFocus.Item {...(control as ComponentProps<typeof RovingFocus.Item>)} />;
}
