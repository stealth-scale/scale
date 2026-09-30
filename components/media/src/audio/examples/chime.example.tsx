import { type ReactElement, useRef, useState } from "react";

import { PlayIcon, SquareIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Audio } from "#audio/index.ts";

import chime from "./chime.webm";

export function Chime(): ReactElement {
  const { t } = useWords("audio");
  const player = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <Stack align="flex-start" gap="sm">
      <Text as="span">{t("chime.label")}</Text>
      <Button
        onClick={() => {
          const element = player.current;

          if (element === null) return;
          if (playing) {
            element.pause();
            element.currentTime = 0;
          } else {
            void element.play();
          }
        }}
        variant="outline"
      >
        {playing ? <SquareIcon /> : <PlayIcon />}
        {playing ? t("chime.stop") : t("chime.play")}
      </Button>
      <Audio
        controls={false}
        onEnded={() => {
          setPlaying(false);
        }}
        onPause={() => {
          setPlaying(false);
        }}
        onPlay={() => {
          setPlaying(true);
        }}
        ref={player}
        src={chime}
      />
    </Stack>
  );
}
