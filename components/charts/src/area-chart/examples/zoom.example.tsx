import { type ReactElement, useState } from "react";

import { Slider } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { AreaChart } from "#area-chart/index.ts";

function dayAt(index: number): Date {
  return new Date(Date.UTC(2025, 9, 1 + index));
}

const YEAR = Array.from({ length: 365 }, (_, index) => {
  const day = dayAt(index);
  const weekend = [0, 6].includes(day.getUTCDay()) ? 0.62 : 1;
  const launch = index >= 330 && index < 337 ? 1.7 : 1;

  return {
    day: day.toISOString().slice(0, 10),
    visitors: Math.round((3900 + index * 7) * weekend * launch),
  };
});

export function Zoom(): ReactElement {
  const { i18n, t } = useWords("area-chart");
  const [range, setRange] = useState([YEAR.length - 91, YEAR.length - 1]);
  const [from = 0, to = 0] = range;
  const dates = new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeZone: "UTC" });

  return (
    <Stack>
      <AreaChart
        caption={t("zoom.caption")}
        categoryKey="day"
        curve="linear"
        data={YEAR.slice(from, to + 1)}
        label={t("zoom.label")}
        labelOptions={{ day: "numeric", month: "short", timeZone: "UTC" }}
        series={[{ key: "visitors", label: t("zoom.visitors") }]}
      />
      <Slider.Root
        getAriaValueText={({ value }) => dates.format(dayAt(value))}
        max={YEAR.length - 1}
        minStepsBetweenThumbs={6}
        onValueChange={({ value }) => {
          setRange(value);
        }}
        value={range}
      >
        <Slider.Label>{t("zoom.range")}</Slider.Label>
        <Slider.ValueText>{dates.formatRange(dayAt(from), dayAt(to))}</Slider.ValueText>
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb index={0} label={t("zoom.from")} />
          <Slider.Thumb index={1} label={t("zoom.to")} />
        </Slider.Control>
      </Slider.Root>
    </Stack>
  );
}
