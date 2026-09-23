import { type ReactElement } from "react";

import { Text } from "@stealthscale/component-typography";

import * as Grid from "#grid/index.ts";

const DAYS = Array.from({ length: 12 }, (_, index) => index + 1);

export function Days(props: Grid.RootProps): ReactElement {
  return (
    <Grid.Root {...props}>
      {DAYS.map((day) => (
        <Text align="center" key={day}>
          {day}
        </Text>
      ))}
    </Grid.Root>
  );
}
