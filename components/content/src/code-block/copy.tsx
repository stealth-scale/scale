/**
 * Renders the control that copies the code of the code block.
 *
 * @remarks
 *   The code comes from the root's context, so the copied text always matches the rendered text.
 *   The control reuses `Clipboard` and `IconButton` from `component-actions`. The caller passes
 *   both icons, because the library ships no icon set, and the accessible names as `label` and
 *   `copiedLabel`, which default to English. The button's size, palette and variant come through
 *   `ButtonPropsProvider`, because a trigger rendered `as` another component forwards only the
 *   machine's props.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { ButtonPropsProvider, Clipboard, IconButton } from "@stealthscale/component-actions";

import { useCode } from "#code-block/state.ts";

/**
 * Button variants of the trigger: the extra-small ghost button in the neutral palette, so the icon
 * reads as part of the header.
 */
const CONTROL = { palette: "neutral", size: "xs", variant: "ghost" } as const;

/**
 * Props of `CodeBlock.Copy`: the two icons, the two accessible names, and the clipboard root props
 * except `value`, which the block supplies.
 */
export interface CopyProps extends Omit<ComponentProps<typeof Clipboard.Root>, "value"> {
  /**
   * Icon in the idle state.
   */
  readonly children?: ReactNode;

  /**
   * Icon in the copied state, for the duration of the machine's timeout.
   */
  readonly copied?: ReactNode;

  /**
   * Accessible name in the copied state. Defaults to "Copied to clipboard".
   */
  readonly copiedLabel?: string | undefined;

  /**
   * Accessible name in the idle state. Defaults to "Copy to clipboard".
   */
  readonly label?: string | undefined;
}

/**
 * Renders the copy control, which swaps its icon after a successful copy.
 */
export function Copy({ children, copied, copiedLabel, label, ...rest }: CopyProps): ReactElement {
  const { code } = useCode();

  return (
    <Clipboard.Root {...rest} value={code}>
      <ButtonPropsProvider value={CONTROL}>
        <Clipboard.Trigger as={IconButton} copiedLabel={copiedLabel} label={label}>
          <Clipboard.Indicator copied={copied}>{children}</Clipboard.Indicator>
        </Clipboard.Trigger>
      </ButtonPropsProvider>
    </Clipboard.Root>
  );
}
