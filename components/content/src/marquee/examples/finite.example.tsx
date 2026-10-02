import { type ReactElement, useState } from "react";

import { PauseIcon, PlayIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Marquee from "#marquee/index.ts";

const NOTICES = ["maintenance", "window", "contact"] as const;

export function Finite(): ReactElement {
  const { t } = useWords("marquee");
  const [loops, setLoops] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <Stack gap="sm">
      <Marquee.Root
        aria-label={t("finite.label")}
        autoFill
        delay={1}
        loopCount={2}
        onComplete={() => {
          setDone(true);
        }}
        onLoopComplete={() => {
          setLoops((count) => count + 1);
        }}
      >
        <Marquee.Viewport>
          <Marquee.Content>
            {NOTICES.map((notice) => (
              <Marquee.Item key={notice}>
                <Text size="sm">{t(`finite.notices.${notice}`)}</Text>
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
      <Text as="output" size="sm" tone="muted">
        {done ? t("finite.done") : t("finite.loops", { count: loops })}
      </Text>
    </Stack>
  );
}
