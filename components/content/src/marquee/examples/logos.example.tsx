import { type ReactElement } from "react";

import { BuildingIcon, PauseIcon, PlayIcon } from "lucide-react";

import { Group } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Marquee from "#marquee/index.ts";

const CUSTOMERS = ["bridge", "halden", "perrin", "voss", "ilan"] as const;

export function Logos(
  props: Omit<Marquee.RootProps, "aria-label" | "aria-labelledby">,
): ReactElement {
  const { t } = useWords("marquee");

  return (
    <Marquee.Root aria-label={t("logos.label")} autoFill {...props}>
      <Marquee.Viewport>
        <Marquee.Content>
          {CUSTOMERS.map((customer) => (
            <Marquee.Item key={customer}>
              <Group gap="xs">
                <BuildingIcon aria-hidden />
                <Text weight="semibold">{t(`logos.customers.${customer}`)}</Text>
              </Group>
            </Marquee.Item>
          ))}
        </Marquee.Content>
      </Marquee.Viewport>
      <Marquee.Edge side="start" />
      <Marquee.Edge side="end" />
      <Marquee.PauseTrigger pauseLabel={t("pause")} playLabel={t("play")}>
        <Marquee.PauseIndicator pause={<PauseIcon />} play={<PlayIcon />} />
      </Marquee.PauseTrigger>
    </Marquee.Root>
  );
}
