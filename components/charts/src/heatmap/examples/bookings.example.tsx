import { type ReactElement, useState } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { type CalendarCell, calendarCells, Heatmap } from "#heatmap/index.ts";

import { BOOKINGS } from "./days.ts";

export function Bookings(): ReactElement {
  const { i18n, t } = useWords("heatmap");
  const [picked, setPicked] = useState<CalendarCell>();

  return (
    <Stack>
      <Heatmap
        {...calendarCells(BOOKINGS, { locale: i18n.language })}
        caption={t("bookings.caption")}
        label={t("bookings.label")}
        onSelect={setPicked}
        size="lg"
        valueLabel={t("bookings.value")}
      />
      <Text as="output" size="sm" tone="muted">
        {picked === undefined
          ? t("bookings.none")
          : t("bookings.picked", { count: picked.value, date: picked.label })}
      </Text>
    </Stack>
  );
}
