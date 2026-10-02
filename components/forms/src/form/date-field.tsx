/**
 * Renders a date field of a form: a date input bound to a string field whose value is an ISO 8601
 * date.
 *
 * @remarks
 *   The input is the library's `DateInput`, one segment per part of the date, named and ordered in
 *   the locale. The field's value is the date as `2026-10-01`, which JSON Schema's
 *   `format: "date"` reads, and is empty while a segment is empty, so `required` refuses it and an
 *   optional date is left out of the values. Its hidden input takes the field's name, through which
 *   focus moves to the first segment. The field counts as left once focus leaves the segments, not
 *   as it moves between them, and its blur validators run then. A schema picks it for a string with
 *   `format: "date"`. The input is short unless the field or its presentation states a width.
 */

import { type ReactElement } from "react";

import * as DateInput from "#date-input/index.ts";
import { useBoundField } from "#form/bound.ts";
import { datesOf } from "#form/dates.ts";
import { Frame, type FramedFieldProps } from "#form/frame.tsx";
import { isLeaving } from "#form/leaving.ts";

/**
 * Describes what a date field is given.
 */
export type DateFieldProps = FramedFieldProps;

/**
 * Renders a date input in a frame, bound to the date field in scope.
 *
 * @param props - The words of the label, whether a value is required, the presentation and the
 *   width.
 * @returns The field, with the date input inside it.
 */
export function DateField({ label, presentation, required, width }: DateFieldProps): ReactElement {
  const field = useBoundField<string | undefined>();

  return (
    <Frame label={label} required={required} width={width ?? presentation?.width ?? "short"}>
      {({ name }) => (
        <DateInput.Root
          name={name}
          onBlur={(event) => {
            if (isLeaving(event)) field.handleBlur();
          }}
          onValueChange={({ value: [date] }) => {
            field.handleChange(date?.toString());
          }}
          value={datesOf(field.state.value)}
        >
          <DateInput.Control>
            <DateInput.Segments />
          </DateInput.Control>
        </DateInput.Root>
      )}
    </Frame>
  );
}
