/**
 * Renders the clipped text as the trigger of the tooltip that shows the whole text.
 *
 * @remarks
 *   The text takes the tooltip trigger's handlers and state and leaves out its `aria-describedby`,
 *   because the tooltip repeats the text a screen reader already reads. A tab stop exists only
 *   while the text is clipped and a caller asks for one, because a stop that opens nothing is
 *   noise.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { useTooltip } from "#tooltip/machine.ts";
import { withContext } from "#truncate/context.ts";

/**
 * Renders the `span` with the truncate class.
 */
const Spanned = withContext("span");

/**
 * Describes the props of the clipped text: whether it is clipped, whether it takes a tab stop, its
 * line count, and the props of a `span`.
 */
export interface ClippedProps extends ComponentProps<typeof Spanned> {
  /**
   * Whether the text is cut off.
   */
  readonly clipped: boolean;

  /**
   * Whether the text takes a tab stop while it is cut off.
   */
  readonly focusable: boolean;

  /**
   * Lines the text keeps.
   */
  readonly lines: number;
}

/**
 * Renders the clipped text with the tooltip trigger's props merged under the caller's.
 *
 * @param props - The clipped state, the tab stop, the line count and the props of a `span`.
 * @returns The `span` element.
 */
export function Clipped({
  clipped,
  focusable,
  lines,
  style,
  ...props
}: ClippedProps): ReactElement {
  const { "aria-describedby": _described, ...trigger } = useTooltip().getTriggerProps();
  const clamp: Record<string, string> = { "--truncate-lines": String(lines) };

  return (
    <Spanned
      {...mergeProps(trigger, props)}
      data-truncated={clipped ? "" : undefined}
      style={{ ...clamp, ...style }}
      tabIndex={focusable && clipped ? 0 : undefined}
    />
  );
}
