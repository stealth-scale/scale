import { type ReactElement } from "react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Grid from "#grid/index.ts";

const DAYS = Array.from({ length: 11 }, (_, index) => index + 2);

export function Day(): ReactElement {
  const { t } = useWords("grid");

  return (
    <Grid.Root align="baseline" columns="12">
      <Grid.Item span="1">
        <Text size="sm" truncate weight="semibold">
          {t("launch")}
        </Text>
      </Grid.Item>
      {DAYS.map((day) => (
        <Text align="center" key={day}>
          {day}
        </Text>
      ))}
    </Grid.Root>
  );
}
