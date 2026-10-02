/**
 * Renders the value in words.
 *
 * @remarks
 *   Without children the value text shows the machine's formatted value, `62%` by default, and
 *   nothing while the value is not known. It is not a live region, so a screen reader does not
 *   announce every change. Pass `aria-live="polite"` to announce them.
 */

import { type ComponentProps, type ReactElement } from "react";

import { mergeProps } from "@zag-js/react";

import { withContext } from "#progress/context.ts";
import { useProgress } from "#progress/machine.ts";

/**
 * Renders the value `span`.
 */
const Valued = withContext("span", "valueText");

/**
 * Describes the props of `ValueText`.
 */
export type ValueTextProps = ComponentProps<typeof Valued>;

/**
 * Renders the children, or the formatted value.
 *
 * @param props - The `span` element's props.
 * @returns The `span` element.
 */
export function ValueText({ children, ...rest }: ValueTextProps): ReactElement {
  const api = useProgress();

  return (
    <Valued {...mergeProps(api.getValueTextProps(), { "aria-live": "off" }, rest)}>
      {children ?? (api.indeterminate ? null : api.valueAsString)}
    </Valued>
  );
}
