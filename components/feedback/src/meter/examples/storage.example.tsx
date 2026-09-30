import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Meter from "#meter/index.ts";

const GIGABYTES: Intl.NumberFormatOptions = {
  maximumFractionDigits: 1,
  style: "unit",
  unit: "gigabyte",
};

export function Storage(props: Omit<Meter.RootProps, "value">): ReactElement {
  const { t } = useWords("meter");

  return (
    <Meter.Root formatOptions={GIGABYTES} max={50} value={38.2} {...props}>
      <Meter.Label>{t("storage")}</Meter.Label>
      <Meter.ValueText />
      <Meter.Track>
        <Meter.Range />
      </Meter.Track>
    </Meter.Root>
  );
}
