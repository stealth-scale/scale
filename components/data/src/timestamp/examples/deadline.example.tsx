import { type ReactElement } from "react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Timestamp } from "#timestamp/index.ts";

const NOW = new Date("2026-07-25T14:30:00Z");

export function Deadline(): ReactElement {
  const { t } = useWords("timestamp");

  return (
    <Text>
      {t("deadline.closes")}{" "}
      <Timestamp
        now={NOW}
        options={{ dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Amsterdam" }}
        reads="relative"
        value={NOW.getTime() + 10_800_000}
      />
    </Text>
  );
}
