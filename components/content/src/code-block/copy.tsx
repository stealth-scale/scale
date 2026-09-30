/**
 * Renders the control that copies the code of a code block.
 *
 * @remarks
 *   The control reads the code from the root, so the copied text is the rendered text. Terminal
 *   output is copied without its escapes, as a person reads it. It renders `Clipboard` with an
 *   `IconButton` trigger from `component-actions`. The caller passes both icons and may pass
 *   `label` and `copiedLabel`, which default to English. The button's size, palette and variant
 *   come from `ButtonPropsProvider`, because a trigger rendered through `as` forwards only the
 *   machine's props.
 */

import { type ComponentProps, type ReactElement, type ReactNode } from "react";

import { ButtonPropsProvider, Clipboard, IconButton } from "@stealthscale/component-actions";

import { ANSI, stripAnsi } from "#code-block/ansi.ts";
import { useCode } from "#code-block/state.ts";

/**
 * Button variants of the trigger: an extra-small ghost button in the neutral palette.
 */
const CONTROL = { palette: "neutral", size: "xs", variant: "ghost" } as const;

/**
 * Describes the props of `Copy`: the two icons, the two accessible names, and the clipboard root's
 * props except `value`, which the block supplies.
 */
export interface CopyProps extends Omit<ComponentProps<typeof Clipboard.Root>, "value"> {
  /**
   * Icon in the idle state.
   */
  readonly children?: ReactNode;

  /**
   * Icon in the copied state, for the machine's timeout.
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
 * Renders the copy control, which shows the copied icon after a successful copy.
 */
export function Copy({ children, copied, copiedLabel, label, ...rest }: CopyProps): ReactElement {
  const { code, language } = useCode();

  return (
    <Clipboard.Root {...rest} value={language === ANSI ? stripAnsi(code) : code}>
      <ButtonPropsProvider value={CONTROL}>
        <Clipboard.Trigger as={IconButton} copiedLabel={copiedLabel} label={label}>
          <Clipboard.Indicator copied={copied}>{children}</Clipboard.Indicator>
        </Clipboard.Trigger>
      </ButtonPropsProvider>
    </Clipboard.Root>
  );
}
