import { type ReactElement } from "react";

import { PauseIcon, PlayIcon } from "lucide-react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Marquee from "#marquee/index.ts";

const WORDS = ["plan", "build", "ship", "learn"] as const;

export function Speed(
  props: Omit<Marquee.RootProps, "aria-label" | "aria-labelledby">,
): ReactElement {
  const { t } = useWords("marquee");

  return (
    <Marquee.Root aria-label={t("speed.label")} autoFill {...props}>
      <Marquee.Viewport>
        <Marquee.Content>
          {WORDS.map((word) => (
            <Marquee.Item key={word}>
              <Text weight="semibold">{t(`speed.words.${word}`)}</Text>
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
