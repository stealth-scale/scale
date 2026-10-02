import { type ReactElement } from "react";

import { Strong, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Timestamp } from "#timestamp/index.ts";

const NOW = new Date("2026-07-25T14:30:00Z");

const TAKEN: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Europe/Amsterdam",
};

export function Vitals(): ReactElement {
  const { t } = useWords("timestamp");

  return (
    <Text>
      <Strong>{t("vitals.reading")}</Strong> {t("vitals.recorded")}{" "}
      <Timestamp now={NOW} options={TAKEN} reads="both" value="2026-07-25T07:50:00Z" />
    </Text>
  );
}
