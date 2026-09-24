/**
 * Renders the package's `Textarea` as the field's control.
 *
 * @remarks
 *   The part takes every prop of `Textarea`, `grows` and `maxRows` included, and the field's
 *   identifier, state, size and `maxLength`, which a prop the caller states overrides. The field's
 *   control class lands on the textarea's box, which is the grid item the field places. The part
 *   keeps the field's tally at its value's length, so `Field.Counter` counts it.
 */

import { type ChangeEvent, type ComponentProps, type ReactElement } from "react";

import { omitUndefined } from "@stealthscale/hooks";

import { withContext } from "#field/context.ts";
import { useWired } from "#field/wired.ts";
import { Textarea as Growing } from "#textarea/textarea.tsx";

/**
 * Renders the package's `Textarea` with the field's control class.
 */
const Filled = withContext(Growing, "control");

/**
 * Describes the props of the part: the props of the package's `Textarea`.
 */
export type TextareaProps = ComponentProps<typeof Filled>;

/**
 * Renders the textarea, wired to the field around it.
 *
 * @param props - The textarea's own props, which override the field's.
 * @returns The textarea's box, named and described by the field's parts.
 */
export function Textarea({ defaultValue, onChange, value, ...props }: TextareaProps): ReactElement {
  const wired = useWired(defaultValue, value);

  return (
    <Filled
      {...wired.props}
      {...omitUndefined({ defaultValue, value })}
      {...props}
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
        wired.typed(event.target.value.length);
        onChange?.(event);
      }}
    />
  );
}
