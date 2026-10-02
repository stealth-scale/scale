import { type ReactElement } from "react";

import { ColorSwatch } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Meter from "#meter/index.ts";

const PLANS = [
  { key: "starter", value: 412 },
  { key: "growth", value: 268 },
  { key: "scale", value: 97 },
] as const;

const ACCOUNTS = PLANS.reduce((sum, plan) => sum + plan.value, 0);

export function Shares(): ReactElement {
  const { i18n, t } = useWords("meter");
  const percent = new Intl.NumberFormat(i18n.language, { style: "percent" });
  const shares = PLANS.map(({ key, value }) =>
    t(`shares.${key}`, { share: percent.format(value / ACCOUNTS) }),
  );

  return (
    <Stack gap="sm">
      <Meter.Root max={ACCOUNTS} value={ACCOUNTS}>
        <Meter.Label>{t("shares.label")}</Meter.Label>
        <Meter.ValueText>{t("shares.value", { count: ACCOUNTS })}</Meter.ValueText>
        <Meter.Track aria-valuetext={new Intl.ListFormat(i18n.language).format(shares)}>
          {PLANS.map(({ key, value }) => (
            <Meter.Segment key={key} value={value} />
          ))}
        </Meter.Track>
      </Meter.Root>
      <Stack direction="row" gap="md" wrap>
        {PLANS.map(({ key }, at) => (
          <Text as="span" key={key} size="xs">
            <ColorSwatch
              aria-hidden
              shape="circle"
              size="inherit"
              value={`var(--colors-series-${String(at + 1)})`}
            />{" "}
            {shares[at]}
          </Text>
        ))}
      </Stack>
    </Stack>
  );
}
