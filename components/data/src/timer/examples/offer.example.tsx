import { type ReactElement } from "react";

import * as Timer from "#timer/index.ts";

const LEFT = Timer.parse({ minutes: 14, seconds: 59 });

export function Offer(props: Timer.RootProps): ReactElement {
  return (
    <Timer.Root autoStart countdown startMs={LEFT} {...props}>
      <Timer.Area>
        <Timer.Item type="minutes" />
        <Timer.Separator>:</Timer.Separator>
        <Timer.Item type="seconds" />
      </Timer.Area>
    </Timer.Root>
  );
}
