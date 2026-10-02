import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Heatmap } from "#heatmap/index.ts";

export function Quiet(): ReactElement {
  const { t } = useWords("heatmap");

  return (
    <Heatmap
      caption={t("quiet.caption")}
      cells={[]}
      empty={t("quiet.empty")}
      label={t("quiet.label")}
    />
  );
}
