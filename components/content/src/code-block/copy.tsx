/**
 * Renders the control that copies the block's code to the clipboard.
 *
 * @remarks
 *   The code is read from the root's context instead of taken as a prop, because the root already
 *   holds it for every other part and a second source could disagree with it. This is the only
 *   interactive part of the block, and so the only one that depends on another package: the
 *   clipboard machine and the icon button both come from the actions package, and wiring a private
 *   copy here would be a second answer to a solved problem. Both glyphs belong to the caller, since
 *   the library ships no icon set: `children` shows at rest and `copied` for the short window after
 *   a successful copy. The accessible label is the caller's for the same reason, because a string
 *   fixed here would be wrong in every locale but one. The button's size, status and variant arrive
 *   through a props provider rather than as props on the trigger, because a trigger rendered `as`
 *   another component forwards the machine's props and drops anything written beside them.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { ButtonPropsProvider, Clipboard, IconButton } from "@stealthscale/component-actions";

import { useCode } from "#code-block/state.ts";

/**
 * The button appearance applied to the trigger, chosen as the quietest icon button available so
 * the glyph reads as part of the header rather than as a competing action.
 */
const CONTROL = { size: "xs", status: "neutral", variant: "ghost" } as const;

/**
 * Props of the copy control: the two glyphs, plus everything the clipboard root accepts apart from
 * `value`, which the block supplies.
 */
export interface CopyProps extends Omit<ComponentProps<typeof Clipboard.Root>, "value"> {
  /**
   * The glyph shown at rest.
   */
  readonly children?: ReactNode;

  /**
   * The glyph shown for the window after a successful copy.
   */
  readonly copied?: ReactNode;
}

/**
 * Copies the block's code on press and swaps the glyph while the copy is fresh.
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
