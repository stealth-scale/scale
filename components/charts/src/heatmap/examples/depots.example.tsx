import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Heading } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { heatmapDomain } from "#heat/index.ts";
import { Heatmap } from "#heatmap/index.ts";

import { DEPOT_HOURS, DEPOTS, hoursOf, SCANS_LAST_WEEK, SCANS_THIS_WEEK } from "./readings.ts";

const WEEKS = [
  { cells: SCANS_THIS_WEEK, week: "this" },
  { cells: SCANS_LAST_WEEK, week: "last" },
];

export function Depots(): ReactElement {
  const { t } = useWords("heatmap");
  const domain = heatmapDomain([...SCANS_THIS_WEEK, ...SCANS_LAST_WEEK]);

  return (
    <Stack gap="lg">
      {WEEKS.map(({ cells, week }) => (
        <Stack gap="sm" key={week}>
          <Heading as="h3" size="sm">
            {t(`depots.${week}`)}
          </Heading>
          <Heatmap
            cells={cells}
            columns={hoursOf(DEPOT_HOURS)}
            corner={t("depots.corner")}
            domain={domain}
            label={t("depots.label", { week: t(`depots.weeks.${week}`) })}
            rows={DEPOTS.map((key) => ({ key, label: t(`names.${key}`) }))}
            valueLabel={t("depots.value")}
          />
        </Stack>
      ))}
    </Stack>
  );
}
