/**
 * Renders the dates as text, or a placeholder while no date is set.
 *
 * @remarks
 *   The text is each date in the machine's `format`, joined by `separator`. The element sets
 *   `data-placeholder-shown` while it shows the placeholder.
 */

import { type ComponentProps, type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#date-picker/context.ts";
import { useDatePicker } from "#date-picker/machine.ts";

/**
 * Renders the `span` with the date picker's value text class.
 */
const Valued = withContext("span", "valueText");

/**
 * Describes the props of the value text: the placeholder, the separator and the props of a
 * `span`.
 */
export interface ValueTextProps extends Omit<ComponentProps<typeof Valued>, "children"> {
  /**
   * Text shown while no date is set.
   */
  readonly placeholder?: string | undefined;

  /**
   * Text between two dates. Defaults to `, `.
   */
  readonly separator?: string | undefined;
}

/**
 * Renders the dates as text, or the placeholder.
 *
 * @param props - The placeholder, the separator and the props of a `span`.
 * @returns The `span` element.
 */
export function ValueText({
  placeholder,
  separator = ", ",
  ...props
}: ValueTextProps): ReactElement {
  const api = useDatePicker();
  const empty = api.value.length === 0;

  return (
    <Valued {...omitUndefined({ "data-placeholder-shown": empty ? "" : undefined })} {...props}>
      {empty ? placeholder : api.valueAsString.join(separator)}
    </Valued>
  );
}
