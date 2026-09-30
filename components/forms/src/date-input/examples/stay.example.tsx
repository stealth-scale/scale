import { type ReactElement, useState } from "react";

import { ArrowRightIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as DateInput from "#date-input/index.ts";

export function Stay(): ReactElement {
  const { t } = useWords("date-input");
  const [value, setValue] = useState<DateInput.DateValue[]>(() => [
    DateInput.parseDate("2026-10-02"),
    DateInput.parseDate("2026-10-05"),
  ]);
  const [start, end] = value;
  const nights = start === undefined || end === undefined ? undefined : end.compare(start);

  return (
    <Stack align="flex-start" gap="md">
      <DateInput.Root
        invalid={nights !== undefined && nights < 1}
        onValueChange={({ value: next }) => {
          setValue(next);
        }}
        selectionMode="range"
        value={value}
      >
        <DateInput.Label>{t("stay.label")}</DateInput.Label>
        <DateInput.Control>
          <DateInput.Segments aria-label={t("stay.start")} />
          <ArrowRightIcon />
          <DateInput.Segments aria-label={t("stay.end")} index={1} />
        </DateInput.Control>
      </DateInput.Root>
      <Text as="output">
        {nights === undefined
          ? t("stay.pick")
          : nights < 1
            ? t("stay.order")
            : t("stay.nights", { count: nights })}
      </Text>
    </Stack>
  );
}
