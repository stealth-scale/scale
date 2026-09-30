import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { ArrowRightIcon, CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as DatePicker from "#date-picker/index.ts";

const PRESETS = ["last7Days", "last30Days", "thisMonth", "lastMonth"] as const;

export function Report(): ReactElement {
  const { t } = useWords("date-picker");

  return (
    <DatePicker.Root
      defaultValue={[DatePicker.parseDate("2026-09-01"), DatePicker.parseDate("2026-09-30")]}
      maxView="day"
      name="period"
      selectionMode="range"
    >
      <DatePicker.Label>{t("report.label")}</DatePicker.Label>
      <DatePicker.Control>
        <DatePicker.Input aria-label={t("report.start")} index={0} />
        <ArrowRightIcon />
        <DatePicker.Input aria-label={t("report.end")} index={1} />
        <DatePicker.Trigger label={t("choose")}>
          <CalendarIcon />
        </DatePicker.Trigger>
      </DatePicker.Control>
      {createPortal(
        <DatePicker.Positioner>
          <DatePicker.Content label={t("choose")}>
            <Stack align="flex-start" direction="row" gap="md">
              <Stack gap="xs">
                {PRESETS.map((preset) => (
                  <DatePicker.PresetTrigger key={preset} value={preset}>
                    {t(`report.presets.${preset}`)}
                  </DatePicker.PresetTrigger>
                ))}
              </Stack>
              <DatePicker.View view="day">
                <DatePicker.Header
                  nextIcon={<ChevronRightIcon />}
                  previousIcon={<ChevronLeftIcon />}
                />
                <DatePicker.DayTable />
              </DatePicker.View>
            </Stack>
          </DatePicker.Content>
        </DatePicker.Positioner>,
        document.body,
      )}
    </DatePicker.Root>
  );
}
