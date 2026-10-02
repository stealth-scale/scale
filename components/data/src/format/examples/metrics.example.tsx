import { type ReactElement } from "react";

import { Grid } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Format from "#format/index.ts";
import * as Stat from "#stat/index.ts";

export function Metrics(): ReactElement {
  const { t } = useWords("format");

  return (
    <Grid.Root columns="fit-xs" gap="md">
      <Stat.Root>
        <Stat.Label>{t("metrics.readers")}</Stat.Label>
        <Stat.ValueText>
          <Format.Number options={{ notation: "compact" }} value={1_248_600} />
        </Stat.ValueText>
      </Stat.Root>
      <Stat.Root>
        <Stat.Label>{t("metrics.growth")}</Stat.Label>
        <Stat.ValueText>
          <Format.Number
            options={{ maximumFractionDigits: 1, signDisplay: "exceptZero", style: "percent" }}
            value={0.073}
          />
        </Stat.ValueText>
      </Stat.Root>
      <Stat.Root>
        <Stat.Label>{t("metrics.trial")}</Stat.Label>
        <Stat.ValueText>
          <Format.Number options={{ style: "unit", unit: "day", unitDisplay: "long" }} value={30} />
        </Stat.ValueText>
      </Stat.Root>
    </Grid.Root>
  );
}
