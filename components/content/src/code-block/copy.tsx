/**
 * Draws the control that copies the code the block holds.
 *
 * @remarks
 *   The part reads the code off the root rather than taking it, because the root already holds it
 *   for every other part and a caller that passed it again could pass something else. It is the
 *   one part of the block that is a control, so it is also the one that reaches into another
 *   package: the clipboard machine and the icon button are the library's, and a block that wired
 *   its own would be a second answer to a question the library has answered.
 *   The marks are the caller's. The library ships no icon set, so every control in it takes its
 *   glyph from the page, and this one takes two: the children at rest and `copied` for the while
 *   after a press. The words are the caller's for the same reason: this package ships none, and a
 *   control that names itself in one language names itself wrongly in every other.
 *   The control's own size, status and look are set above the trigger rather than on it, because
 *   a trigger drawn `as` another component hands that component the machine's props and not the
 *   ones written beside them.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { ButtonPropsProvider, Clipboard, IconButton } from "@stealthscale/component-actions";

import { useCode } from "#code-block/state.ts";

/**
 * Fixes the control the copy is drawn as: the quietest icon button there is, so the mark reads as
 * part of the header rather than as a second thing to press.
 */
const CONTROL = { size: "xs", status: "neutral", variant: "ghost" } as const;

/**
 * Describes what the copy takes: the marks, and everything the clipboard's root takes but the
 * value, which the block holds already.
 */
export interface CopyProps extends Omit<ComponentProps<typeof Clipboard.Root>, "value"> {
  /**
   * The mark shown at rest.
   */
  readonly children?: ReactNode;

  /**
   * The mark shown while the copy is fresh.
   */
  readonly copied?: ReactNode;
}

/**
 * Copies the block's code when it is pressed, and says so for a while.
 *
 * @param props - The two marks, and the clipboard's own options.
 * @returns The control, wired to the code the root holds.
 */
export function Copy({ children, copied, ...rest }: CopyProps): ReactElement {
  const { code } = useCode();

  return (
    <Clipboard.Root {...rest} value={code}>
      <ButtonPropsProvider value={CONTROL}>
        <Clipboard.Trigger as={IconButton}>
          <Clipboard.Indicator copied={copied}>{children}</Clipboard.Indicator>
        </Clipboard.Trigger>
      </ButtonPropsProvider>
    </Clipboard.Root>
  );
}
