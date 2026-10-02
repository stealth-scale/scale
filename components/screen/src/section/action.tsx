/**
 * Renders one action in the header: the library's button, which folds as the section narrows.
 *
 * @remarks
 *   The action renders the library's button, `outline`, or `solid` when `primary`, one size smaller
 *   than the section. On a narrow section an action with an icon shows the icon alone, a primary
 *   action without one keeps its words, and any other action renders nothing and runs from the
 *   menu `Section.Actions` renders. `priority` overrides that choice. `as` renders another control
 *   in the action's place, such as a menu's trigger, and the caller sets its look.
 */

import { type ComponentProps, type MouseEvent, type ReactElement, type ReactNode } from "react";

import { Button } from "@stealthscale/component-actions";

import { NARROW, PRIORITY, type Priority, priorityOf, useFoldable } from "#folding/index.ts";
import { withContext } from "#section/context.ts";
import { buttonSizeOf, useSection } from "#section/state.ts";

/**
 * Renders the library's button with the recipe's action class.
 */
const Acted = withContext(Button, "action");

/**
 * Describes the props of an action: its icon, whether it is primary, its priority and the props of
 * the library's button.
 */
export interface ActionProps extends Omit<ComponentProps<typeof Acted>, "onClick"> {
  /**
   * Icon before the words, which a narrow section shows alone.
   */
  readonly icon?: ReactNode | undefined;

  /**
   * Handler the button or the menu row calls when a reader presses it.
   */
  readonly onClick?: ((event: MouseEvent<HTMLElement>) => void) | undefined;

  /**
   * Whether the action is the section's primary action, which renders solid and keeps its words.
   */
  readonly primary?: boolean | undefined;

  /**
   * Priority that decides how a narrow section folds the action, in place of the one `icon` and
   * `primary` imply.
   */
  readonly priority?: Priority | undefined;
}

/**
 * Renders the action, or nothing while the section folds it into the menu.
 *
 * @param props - The icon, the primary flag, the priority and the props of the library's button.
 * @returns The `button` element, or nothing on a narrow section that folds it.
 */
export function Action({
  as,
  children,
  disabled,
  icon,
  onClick,
  primary = false,
  priority,
  ...rest
}: ActionProps): null | ReactElement {
  const section = useSection();
  const ranked = priorityOf(priority, icon !== undefined, primary);
  const folded = section.narrow && ranked === "tertiary";
  const look =
    as === undefined
      ? ({ size: buttonSizeOf(section.size), variant: primary ? "solid" : "outline" } as const)
      : {};

  useFoldable(folded, {
    disabled,
    label: (
      <>
        {icon}
        {children}
      </>
    ),
    onClick,
  });

  if (folded) return null;

  return (
    <Acted
      as={as}
      disabled={disabled}
      onClick={onClick}
      {...look}
      {...rest}
      {...{ [NARROW]: section.narrow ? "" : undefined, [PRIORITY]: ranked }}
    >
      {icon}
      {icon === undefined ? children : <span>{children}</span>}
    </Acted>
  );
}
