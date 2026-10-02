import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Meter from "#meter/index.ts";

const MEASURES = [
  { key: "deals", target: 250, value: 268 },
  { key: "trials", target: 60, value: 41 },
  { key: "spend", target: 9000, value: 8600 },
] as const;

function paletteOf(key: string, share: number): "primary" | "success" | "warning" {
  if (key === "spend") return share >= 0.9 ? "warning" : "primary";

  return share >= 1 ? "success" : "primary";
}

export function Target(): ReactElement {
  const { t } = useWords("meter");

  return (
    <Stack gap="md">
      {MEASURES.map(({ key, target, value }) => (
        <Meter.Root
          key={key}
          max={Math.max(target, value)}
          palette={paletteOf(key, value / target)}
          value={value}
        >
          <Meter.Label>{t(`target.${key}`)}</Meter.Label>
          <Meter.ValueText>{t("target.value", { target, value })}</Meter.ValueText>
          <Meter.Track aria-valuetext={t("target.spoken", { target, value })}>
            <Meter.Range />
            <Meter.Marker value={target} />
          </Meter.Track>
        </Meter.Root>
      ))}
    </Stack>
  );
}
