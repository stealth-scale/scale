import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as DateInput from "#date-input/index.ts";

const LOCALES = [
  { locale: "en-US", name: "us" },
  { locale: "en-GB", name: "gb" },
  { locale: "de-DE", name: "de" },
  { locale: "ja-JP", name: "jp" },
] as const;

export function Locales(): ReactElement {
  const { t } = useWords("date-input");

  return (
    <Stack gap="md">
      {LOCALES.map(({ locale, name }) => (
        <DateInput.Root
          defaultValue={[DateInput.parseDate("2026-10-14")]}
          key={locale}
          locale={locale}
        >
          <DateInput.Label>{t(`locales.${name}`)}</DateInput.Label>
          <DateInput.Control>
            <DateInput.Segments />
          </DateInput.Control>
        </DateInput.Root>
      ))}
    </Stack>
  );
}
