import { type ReactElement } from "react";

import { PauseIcon, PlayIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Card } from "@stealthscale/component-surfaces";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Marquee from "#marquee/index.ts";

const QUOTES = ["ada", "grace", "margaret"] as const;

export function Testimonials(): ReactElement {
  const { t } = useWords("marquee");

  return (
    <Marquee.Root aria-label={t("testimonials.label")} autoFill side="top" speed={30}>
      <Marquee.Viewport>
        <Marquee.Content>
          {QUOTES.map((quote) => (
            <Marquee.Item key={quote}>
              <Card.Root size="sm">
                <Card.Content>
                  <Stack gap="xs">
                    <Text size="sm">{t(`testimonials.quotes.${quote}.text`)}</Text>
                    <Text size="sm" tone="muted">
                      {t(`testimonials.quotes.${quote}.name`)}
                    </Text>
                  </Stack>
                </Card.Content>
              </Card.Root>
            </Marquee.Item>
          ))}
        </Marquee.Content>
      </Marquee.Viewport>
      <Marquee.Edge side="top" />
      <Marquee.Edge side="bottom" />
      <Marquee.PauseTrigger pauseLabel={t("pause")} playLabel={t("play")}>
        <Marquee.PauseIndicator pause={<PauseIcon />} play={<PlayIcon />} />
      </Marquee.PauseTrigger>
    </Marquee.Root>
  );
}
