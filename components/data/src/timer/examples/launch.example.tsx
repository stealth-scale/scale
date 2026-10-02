import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Timer from "#timer/index.ts";

const LEFT = Timer.parse({ days: 12, hours: 3, minutes: 45, seconds: 10 });

const UNITS = ["days", "hours", "minutes", "seconds"] as const;

export function Launch(): ReactElement {
  const { t } = useWords("timer");

  return (
    <Timer.Root autoStart countdown startMs={LEFT} variant="subtle">
      <Timer.Area>
        {UNITS.map((unit) => [
          <Timer.Item key={unit} type={unit} />,
          <Timer.Separator key={`${unit}-unit`}>{t(`launch.${unit}`)}</Timer.Separator>,
        ])}
      </Timer.Area>
    </Timer.Root>
  );
}
