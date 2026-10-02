/**
 * Renders a date picker bound to a string field of a form whose value is an ISO 8601 date.
 *
 * @remarks
 *   The picker is the library's `DatePicker`: a date input with a trigger that opens a calendar of
 *   the month. A presentation picks it for a string of the `date` format whose `control` is
 *   `date-picker`. The field's value is the date as `2026-10-01`, and is empty while the input
 *   shows no whole date. The trigger and the calendar render where the field or the form gives the
 *   date glyphs, and the input alone otherwise. The trigger and the calendar read their names from
 *   `<id>.actions.chooseDate`, else English. The field counts as left once focus leaves the input
 *   and the trigger, and its blur validators run then. The input is short unless the field or its
 *   presentation states a width.
 */

import { type ReactElement } from "react";

import { Portal } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/provider-form";

import * as DatePicker from "#date-picker/index.ts";
import { useBoundField } from "#form/bound.ts";
import { datesOf } from "#form/dates.ts";
import { Frame, type FramedFieldProps } from "#form/frame.tsx";
import { isLeaving } from "#form/leaving.ts";
import { type DateGlyphs, useFormScope } from "#form/scope.ts";

/**
 * Describes what a date picker field is given.
 */
export interface DatePickerFieldProps extends FramedFieldProps {
  /**
   * Glyphs of the trigger and the calendar, in place of the form's.
   */
  readonly glyphs?: DateGlyphs | undefined;
}

/**
 * Renders a date picker in a frame, bound to the date field in scope.
 *
 * @param props - The words of the label, whether a value is required, the glyphs, the
 *   presentation and the width.
 * @returns The field, with the picker inside it.
 */
export function DatePickerField({
  glyphs,
  label,
  presentation,
  required,
  width,
}: DatePickerFieldProps): ReactElement {
  const field = useBoundField<string | undefined>();
  const words = useWords();
  const scope = useFormScope();
  const marks = glyphs ?? scope.glyphs.date;
  const choose = words.action("chooseDate", "Choose a date");

  return (
    <Frame label={label} required={required} width={width ?? presentation?.width ?? "short"}>
      {({ name }) => (
        <DatePicker.Root
          name={name}
          onValueChange={({ value: [date] }) => {
            field.handleChange(date?.toString());
          }}
          value={datesOf(field.state.value)}
        >
          <DatePicker.Control
            onBlur={(event) => {
              if (isLeaving(event)) field.handleBlur();
            }}
          >
            <DatePicker.Input />
            {marks === undefined ? null : (
              <DatePicker.Trigger label={choose}>{marks.calendar}</DatePicker.Trigger>
            )}
          </DatePicker.Control>
          {marks === undefined ? null : (
            <Portal>
              <DatePicker.Positioner>
                <DatePicker.Content label={choose}>
                  <DatePicker.View view="day">
                    <DatePicker.Header nextIcon={marks.next} previousIcon={marks.previous} />
                    <DatePicker.DayTable />
                  </DatePicker.View>
                </DatePicker.Content>
              </DatePicker.Positioner>
            </Portal>
          )}
        </DatePicker.Root>
      )}
    </Frame>
  );
}
