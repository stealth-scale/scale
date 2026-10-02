import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Meter from "#meter/index.ts";

const LIMITS = [
  { key: "seats", max: 10, value: 8 },
  { key: "storage", max: 50, value: 46 },
  { key: "requests", max: 100_000, value: 72_400 },
] as const;

function paletteOf(share: number): "error" | "primary" | "warning" {
  if (share >= 0.9) return "error";

  return share >= 0.75 ? "warning" : "primary";
}

export function Usage(): ReactElement {
  const { t } = useWords("meter");

  return (
    <Stack gap="md">
      {LIMITS.map(({ key, max, value }) => {
        const words = t(`usage.${key}.value`, { max, value });

        return (
          <Meter.Root key={key} max={max} palette={paletteOf(value / max)} value={value}>
            <Meter.Label>{t(`usage.${key}.label`)}</Meter.Label>
            <Meter.ValueText>{words}</Meter.ValueText>
            <Meter.Track aria-valuetext={words}>
              <Meter.Range />
            </Meter.Track>
          </Meter.Root>
        );
      })}
    </Stack>
  );
}
