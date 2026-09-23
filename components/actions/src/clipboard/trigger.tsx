/**
 * Renders the button that copies the value.
 *
 * @remarks
 *   `label` and `copiedLabel` set the accessible name in the idle and the copied state, with
 *   English defaults. A trigger with visible text passes that text as `label` and shows
 *   `copiedLabel` during the copied state, so the name contains the visible label (WCAG 2.5.3). The
 *   slot has no control styles. Pass `as={Button}` or `as={IconButton}` to render it as the
 *   library's button.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#clipboard/context.ts";
import { useClipboard } from "#clipboard/machine.ts";

/**
 * `button` bound to the trigger slot.
 */
const Styled = withContext("button", "trigger");

/**
 * Default accessible name in the idle state.
 */
const LABEL = "Copy to clipboard";

/**
 * Default accessible name in the copied state.
 */
const COPIED_LABEL = "Copied to clipboard";

/**
 * Props of `Clipboard.Trigger`: the two accessible names and the props of the styled `button`.
 */
export interface TriggerProps extends ComponentProps<typeof Styled> {
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
 * Renders the button with the caller's props merged over the machine's.
 *
 * @remarks
 *   An `aria-label` the caller passes takes precedence over both names.
 * @param props - The two accessible names and the props of the styled `button`.
 * @returns The button, wired to the machine's copy handler.
 */
export function Trigger({
  copiedLabel = COPIED_LABEL,
  label = LABEL,
  ...rest
}: TriggerProps): ReactElement {
  const api = useClipboard();
  const named = { "aria-label": api.copied ? copiedLabel : label };

  return <Styled {...mergeProps(api.getTriggerProps(), named, rest)} />;
}
