import { type ReactElement } from "react";

import { Card } from "@stealthscale/component-surfaces";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Grid from "#grid/index.ts";

const DAYS = Array.from({ length: 11 }, (_, index) => index + 2);

export function Launch(props: Grid.ItemProps): ReactElement {
  const { t } = useWords("grid");

  return (
    <Grid.Root align="baseline" columns="12">
      <Grid.Item {...props}>
        <Card.Root size="sm" variant="subtle">
          <Card.Content>
            <Text truncate>{t("launch")}</Text>
          </Card.Content>
        </Card.Root>
      </Grid.Item>
      {DAYS.map((day) => (
        <Text align="center" key={day}>
          {day}
        </Text>
      ))}
    </Grid.Root>
  );
}
