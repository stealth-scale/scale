import { type ReactElement, useRef, useState } from "react";

import { PauseIcon, PlayIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Video } from "#video/index.ts";

import clip from "./clip.webm";
import poster from "./poster.webp";

export function Background(): ReactElement {
  const { t } = useWords("video");
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  return (
    <Stack align="flex-start" gap="sm">
      <Video
        autoPlay
        controls={false}
        loop
        onPause={() => {
          setPlaying(false);
        }}
        onPlay={() => {
          setPlaying(true);
        }}
        poster={poster}
        ref={video}
        src={clip}
      />
      <Button
        onClick={() => {
          if (video.current?.paused === false) video.current.pause();
          else void video.current?.play();
        }}
        size="sm"
        variant="outline"
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
        {playing ? t("pause") : t("play")}
      </Button>
    </Stack>
  );
}
