import { type ReactElement, useState } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Heatmap, type HeatmapCell } from "#heatmap/index.ts";

import { ERRORS, hoursOf, INCIDENT_HOURS } from "./readings.ts";

export function Incidents(): ReactElement {
  const { t } = useWords("heatmap");
  const [picked, setPicked] = useState<HeatmapCell>();

  return (
    <Stack align="flex-start">
      <Heatmap
        caption={t("incidents.caption")}
        cells={ERRORS}
        columns={hoursOf(INCIDENT_HOURS)}
        corner={t("incidents.corner")}
        label={t("incidents.label")}
        onSelect={setPicked}
        size="lg"
        valueLabel={t("incidents.value")}
      />
      <Text as="output" size="sm" tone="muted">
        {picked === undefined
          ? t("incidents.none")
          : t("incidents.picked", {
              count: picked.value,
              hour: picked.column,
              service: picked.row,
            })}
      </Text>
    </Stack>
  );
}
