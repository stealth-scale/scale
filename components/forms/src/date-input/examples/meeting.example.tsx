import { type ReactElement, useState } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as DateInput from "#date-input/index.ts";

const HOST = "America/New_York";

const GUEST = "Europe/Amsterdam";

export function Meeting(): ReactElement {
  const { i18n, t } = useWords("date-input");
  const [value, setValue] = useState<DateInput.DateValue[]>(() => [
    DateInput.parseZonedDateTime(`2026-10-14T09:30[${HOST}]`),
  ]);
  const [start] = value;
  const local = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: GUEST,
  });

  return (
    <Stack align="flex-start" gap="md">
      <DateInput.Root
        granularity="minute"
        onValueChange={({ value: next }) => {
          setValue(next);
        }}
        timeZone={HOST}
        value={value}
      >
        <DateInput.Label>{t("meeting.label")}</DateInput.Label>
        <DateInput.Control>
          <DateInput.Segments />
        </DateInput.Control>
      </DateInput.Root>
      <Text as="output">
        {start === undefined
          ? t("meeting.none")
          : t("meeting.local", { time: local.format(start.toDate(HOST)) })}
      </Text>
    </Stack>
  );
}
