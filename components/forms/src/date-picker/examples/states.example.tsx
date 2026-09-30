import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as DatePicker from "#date-picker/index.ts";

const STATES = ["disabled", "readOnly", "invalid"] as const;

export function States(): ReactElement {
  const { t } = useWords("date-picker");

  return (
    <Stack gap="md">
      {STATES.map((state) => (
        <DatePicker.Root
          defaultValue={[DatePicker.parseDate("2026-10-14")]}
          disabled={state === "disabled"}
          invalid={state === "invalid"}
          key={state}
          maxView="day"
          readOnly={state === "readOnly"}
        >
          <DatePicker.Label>{t(`states.${state}`)}</DatePicker.Label>
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
                <DatePicker.View view="day">
                  <DatePicker.Header
                    nextIcon={<ChevronRightIcon />}
                    previousIcon={<ChevronLeftIcon />}
                  />
                  <DatePicker.DayTable />
                </DatePicker.View>
              </DatePicker.Content>
            </DatePicker.Positioner>,
            document.body,
          )}
        </DatePicker.Root>
      ))}
    </Stack>
  );
}
