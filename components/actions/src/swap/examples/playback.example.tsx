import { type ReactElement, useState } from "react";

import { PauseIcon, PlayIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { IconButton } from "#button/index.ts";
import * as Swap from "#swap/index.ts";

export function Playback(): ReactElement {
  const { t } = useWords("swap");
  const [playing, setPlaying] = useState(false);

  return (
    <IconButton
      aria-label={playing ? t("playback.pause") : t("playback.play")}
      onClick={() => {
        setPlaying((was) => !was);
      }}
    >
      <Swap.Root swap={playing}>
        <Swap.Indicator type="on">
          <PauseIcon aria-hidden size="1em" />
        </Swap.Indicator>
        <Swap.Indicator type="off">
          <PlayIcon aria-hidden size="1em" />
        </Swap.Indicator>
      </Swap.Root>
    </IconButton>
  );
}
