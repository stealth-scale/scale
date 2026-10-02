import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as DatePicker from "#date-picker/index.ts";

export function Birthday(): ReactElement {
  const { t } = useWords("date-picker");

  return (
    <DatePicker.Root
      defaultFocusedValue={DatePicker.parseDate("1990-06-01")}
      max={DatePicker.today(DatePicker.getLocalTimeZone())}
      maxView="day"
      min={DatePicker.parseDate("1920-01-01")}
    >
      <DatePicker.Label>{t("birthday.label")}</DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Input />
        <DatePicker.Trigger label={t("choose")}>
          <CalendarIcon />
        </DatePicker.Trigger>
      </DatePicker.Control>
      {createPortal(
        <DatePicker.Positioner>
          <DatePicker.Content label={t("choose")}>
            <DatePicker.View view="day">
              <DatePicker.ViewControl>
                <DatePicker.PrevTrigger>
                  <ChevronLeftIcon />
                </DatePicker.PrevTrigger>
                <DatePicker.MonthSelect label={t("birthday.month")} />
                <DatePicker.YearSelect label={t("birthday.year")} />
                <DatePicker.NextTrigger>
                  <ChevronRightIcon />
                </DatePicker.NextTrigger>
              </DatePicker.ViewControl>
              <DatePicker.DayTable />
            </DatePicker.View>
          </DatePicker.Content>
        </DatePicker.Positioner>,
        document.body,
      )}
    </DatePicker.Root>
  );
}
