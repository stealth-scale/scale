/**
 * Renders a control that moves checked rows between the two sides.
 *
 * @remarks
 *   The element is a `button` with `type="button"`, named by `label` through `aria-label`, because
 *   its content is a mark without text.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { withContext } from "#transfer/context.ts";

/**
 * Renders the `button` with the transfer's control class and `type="button"`.
 */
const Pressed = withContext("button", "control", { defaultProps: { type: "button" } });

/**
 * Describes the props of a control: its mark, its name, its press handler and the props of a
 * `button`.
 */
export interface ControlProps extends Omit<
  ComponentProps<typeof Pressed>,
  "aria-label" | "onClick"
> {
  /**
   * Mark rendered inside the control.
   */
  readonly children: ReactNode;

  /**
   * Accessible name of the control.
   */
  readonly label: string;

  /**
   * Called on a press.
   */
  readonly onPress: () => void;
}

/**
 * Renders a control named by `label` that calls `onPress` on a press.
 *
 * @param props - The mark, the accessible name, the press handler and the props of a `button`.
 * @returns The `button` element.
 */
export function Control({ children, label, onPress, ...rest }: ControlProps): ReactElement {
  return (
    <Pressed {...rest} aria-label={label} onClick={onPress}>
      {children}
    </Pressed>
  );
}
