import { type ReactElement, useState } from "react";

import { Volume2Icon, VolumeXIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { IconButton } from "#button/index.ts";
import * as Swap from "#swap/index.ts";

export function Mute(props: Swap.RootProps): ReactElement {
  const { t } = useWords("swap");
  const [muted, setMuted] = useState(false);

  return (
    <IconButton
      aria-label={t("mute.label")}
      aria-pressed={muted}
      onClick={() => {
        setMuted((was) => !was);
      }}
      variant="outline"
    >
      <Swap.Root {...props} swap={muted}>
        <Swap.Indicator type="on">
          <VolumeXIcon aria-hidden size="1em" />
        </Swap.Indicator>
        <Swap.Indicator type="off">
          <Volume2Icon aria-hidden size="1em" />
        </Swap.Indicator>
      </Swap.Root>
    </IconButton>
  );
}
