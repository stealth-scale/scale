import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { ViolinPlot } from "#violin-plot/index.ts";

import { CHECKOUT, PROFILE, SEARCH } from "./endpoints.ts";

export function Replay(): ReactElement {
  const { t } = useWords("violin-plot");
  const [run, setRun] = useState(0);

  return (
    <Stack align="flex-start">
      <ViolinPlot
        animate
        caption={t("endpoints.caption")}
        countLabel={t("requests")}
        groups={[
          { key: "search", label: t("endpoints.search"), values: SEARCH },
          { key: "checkout", label: t("endpoints.checkout"), values: CHECKOUT },
          { key: "profile", label: t("endpoints.profile"), values: PROFILE },
        ]}
        key={run}
        label={t("endpoints.label")}
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
