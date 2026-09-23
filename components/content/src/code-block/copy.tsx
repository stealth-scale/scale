/**
 * Renders the control that copies the code block's code to the clipboard.
 *
 * @remarks
 *   The code comes from the root's context, so the copied text cannot differ from the rendered
 *   text. The control uses the clipboard machine and the icon button from `component-actions`
 *   rather than binding the machine a second time. The caller supplies both icons, and the
 *   accessible label through `translations`, because the library ships no icon set and a fixed
 *   label would be wrong in every locale but one. The button's size, palette and variant come
 *   through `ButtonPropsProvider`, because a trigger rendered `as` another component forwards the
 *   machine's props and drops any prop written beside them.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { ButtonPropsProvider, Clipboard, IconButton } from "@stealthscale/component-actions";

import { useCode } from "#code-block/state.ts";

/**
 * The trigger's button variants: the smallest ghost button in the neutral palette, so the icon
 * reads as part of the header.
 */
const CONTROL = { palette: "neutral", size: "xs", variant: "ghost" } as const;

/**
 * Describes the props of `Copy`: the two icons, and every clipboard root prop except `value`, which
 * the block supplies.
 */
export interface CopyProps extends Omit<ComponentProps<typeof Clipboard.Root>, "value"> {
  /**
   * The icon shown at rest.
   */
  readonly children?: ReactNode;

  /**
   * The icon shown after a successful copy, for the machine's timeout.
   */
  readonly copied?: ReactNode;
}

/**
 * Renders the copy control, which swaps its icon after a successful copy.
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
