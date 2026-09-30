import { type ReactElement, useState } from "react";

import { EyeIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { LineChart } from "#line-chart/index.ts";

const HOURS = [
  [92, 180],
  [95, 190],
  [101, 210],
  [118, 260],
  [142, 340],
  [155, 390],
  [131, 310],
  [112, 240],
  [104, 205],
  [99, 195],
].map(([p50, p95], index) => ({
  hour: `2026-09-28T${String(index + 8).padStart(2, "0")}:00:00Z`,
  p50,
  p95,
  target: 300,
}));

const KEYS = ["p50", "p95", "target"];

export function Controlled(): ReactElement {
  const { t } = useWords("line-chart");
  const [hidden, setHidden] = useState<readonly string[]>(["p50"]);

  return (
    <Stack align="flex-start">
      <LineChart
        caption={t("latency.caption")}
        categoryKey="hour"
        curve="linear"
        data={HOURS}
        hiddenKeys={hidden}
        label={t("latency.label")}
        labelOptions={{ hour: "2-digit", hourCycle: "h23", minute: "2-digit", timeZone: "UTC" }}
        legendLabel={t("series")}
        onHiddenKeysChange={setHidden}
        series={[
          { key: "p50", label: t("latency.p50") },
          { key: "p95", label: t("latency.p95") },
          { color: "error", dashed: true, key: "target", label: t("latency.target") },
        ]}
        valueOptions={{ style: "unit", unit: "millisecond", unitDisplay: "narrow" }}
      />
      <Stack direction="row">
        <Text as="output" size="sm" tone="muted">
          {t("controlled.shown", { count: KEYS.length - hidden.length })}
        </Text>
        <Button
          onClick={() => {
            setHidden([]);
          }}
          size="sm"
          variant="outline"
        >
          <EyeIcon />
          {t("controlled.all")}
        </Button>
      </Stack>
    </Stack>
  );
}
