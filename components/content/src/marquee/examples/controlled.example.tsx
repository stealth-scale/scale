import { type ReactElement, useState } from "react";

import { Switch } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Marquee from "#marquee/index.ts";

const RATES = ["eur", "gbp", "jpy", "chf"] as const;

export function Controlled(): ReactElement {
  const { t } = useWords("marquee");
  const [paused, setPaused] = useState(false);

  return (
    <Stack align="flex-start" gap="sm">
      <Switch.Root
        checked={paused}
        onCheckedChange={(details) => {
          setPaused(details.checked);
        }}
      >
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.Label>{t("controlled.hold")}</Switch.Label>
      </Switch.Root>
      <Marquee.Root
        aria-label={t("controlled.label")}
        autoFill
        onPauseChange={(details) => {
          setPaused(details.paused);
        }}
        paused={paused}
      >
        <Marquee.Viewport>
          <Marquee.Content>
            {RATES.map((rate) => (
              <Marquee.Item key={rate}>
                <Text size="sm">{t(`controlled.rates.${rate}`)}</Text>
              </Marquee.Item>
            ))}
          </Marquee.Content>
        </Marquee.Viewport>
        <Marquee.Edge side="start" />
        <Marquee.Edge side="end" />
      </Marquee.Root>
    </Stack>
  );
}
