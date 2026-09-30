import { type ReactElement } from "react";

import { PauseIcon, PlayIcon } from "lucide-react";

import { Badge } from "@stealthscale/component-data";
import { Group } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Marquee from "#marquee/index.ts";

const HEADLINES = [
  { key: "rates", palette: "info" },
  { key: "outage", palette: "warning" },
  { key: "launch", palette: "success" },
] as const;

export function Ticker(): ReactElement {
  const { t } = useWords("marquee");

  return (
    <Marquee.Root aria-label={t("ticker.label")} autoFill pauseOnInteraction speed={40}>
      <Marquee.Viewport>
        <Marquee.Content>
          {HEADLINES.map(({ key, palette }) => (
            <Marquee.Item key={key}>
              <Group gap="sm">
                <Badge palette={palette}>{t(`ticker.headlines.${key}.topic`)}</Badge>
                <Text size="sm">{t(`ticker.headlines.${key}.text`)}</Text>
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
