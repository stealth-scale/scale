import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as DatePicker from "#date-picker/index.ts";

const VIEWS = [
  { table: <DatePicker.DayTable />, view: "day" },
  { table: <DatePicker.MonthTable />, view: "month" },
  { table: <DatePicker.YearTable />, view: "year" },
] as const;

export function Appointment(props: DatePicker.RootProps): ReactElement {
  const { t } = useWords("date-picker");

  return (
    <DatePicker.Root defaultValue={[DatePicker.parseDate("2026-10-14")]} {...props}>
      <DatePicker.Label>{t("appointment.label")}</DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Input />
        <DatePicker.ClearTrigger label={t("clear")}>
          <XIcon />
        </DatePicker.ClearTrigger>
        <DatePicker.Trigger label={t("choose")}>
          <CalendarIcon />
        </DatePicker.Trigger>
      </DatePicker.Control>
      {createPortal(
        <DatePicker.Positioner>
          <DatePicker.Content label={t("choose")}>
            {VIEWS.map(({ table, view }) => (
              <DatePicker.View key={view} view={view}>
                <DatePicker.Header
                  nextIcon={<ChevronRightIcon />}
                  previousIcon={<ChevronLeftIcon />}
                />
                {table}
              </DatePicker.View>
            ))}
          </DatePicker.Content>
        </DatePicker.Positioner>,
        document.body,
      )}
    </DatePicker.Root>
  );
}
