/**
 * Draws one of the two controls that move rows between the lists.
 *
 * @remarks
 *   The control is a part of this recipe rather than a button from elsewhere, which keeps this
 *   package off every other component package. It is the one element a transfer adds.
 *   It holds a mark and no words, so a caller names it. A control drawn as an arrow and left
 *   unnamed reads out as "button" and says nothing about which way it points.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { withContext } from "#transfer/context.ts";

/**
 * Draws the square the mark sits in.
 */
const Pressed = withContext("button", "control", { defaultProps: { type: "button" } });

/**
 * Describes what one control takes.
 */
export interface ControlProps extends Omit<
  ComponentProps<typeof Pressed>,
  "aria-label" | "onClick"
> {
  /**
   * Drawn inside the control.
   */
  readonly children: ReactNode;

  /**
   * Reads out as the name of the control.
   */
  readonly label: string;

  /**
   * Called when the control is pressed.
   */
  readonly onPress: () => void;
}

/**
 * Moves whatever is picked on one side over to the other.
 *
 * @param props - The mark it draws, the name it reads out as, and what pressing it does.
 * @returns The square, holding the mark.
 */
export function Control({ children, label, onPress, ...rest }: ControlProps): ReactElement {
  return (
    <Pressed {...rest} aria-label={label} onClick={onPress}>
      {children}
    </Pressed>
  );
}
