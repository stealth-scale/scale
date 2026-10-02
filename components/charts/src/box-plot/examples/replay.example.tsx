import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { BoxPlot } from "#box-plot/index.ts";

import { AMSTERDAM, FRANKFURT, SINGAPORE, VIRGINIA } from "./regions.ts";

export function Replay(): ReactElement {
  const { t } = useWords("box-plot");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <BoxPlot
        animate
        caption={t("regions.caption")}
        countLabel={t("requests")}
        groups={[
          { key: "frankfurt", label: t("regions.frankfurt"), values: FRANKFURT },
          { key: "amsterdam", label: t("regions.amsterdam"), values: AMSTERDAM },
          { key: "virginia", label: t("regions.virginia"), values: VIRGINIA },
          { key: "singapore", label: t("regions.singapore"), values: SINGAPORE },
        ]}
        key={run}
        label={t("regions.label")}
        valueOptions={{ style: "unit", unit: "millisecond", unitDisplay: "narrow" }}
      />
      <Button
        onClick={() => {
          setRun(run + 1);
        }}
        size="sm"
        variant="outline"
      >
        <RotateCcwIcon />
        {t("replay.replay")}
      </Button>
    </Stack>
  );
}
