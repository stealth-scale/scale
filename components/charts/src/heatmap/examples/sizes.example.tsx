import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Heatmap } from "#heatmap/index.ts";

import { ERRORS, hoursOf, INCIDENT_HOURS } from "./readings.ts";

export function Sizes(props: Omit<Parameters<typeof Heatmap>[0], "cells" | "label">): ReactElement {
  const { t } = useWords("heatmap");

  return (
    <Heatmap
      cells={ERRORS}
      columns={hoursOf(INCIDENT_HOURS)}
      corner={t("sizes.corner")}
      label={t("sizes.label")}
      valueLabel={t("sizes.value")}
      {...props}
    />
  );
}
