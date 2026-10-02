import { type ReactElement } from "react";

import { Card } from "@stealthscale/component-surfaces";
import { useWords } from "@stealthscale/specimen";

import * as Grid from "#grid/index.ts";

export function Plan(props: Grid.RootProps): ReactElement {
  const { t } = useWords("grid");

  return (
    <Grid.Root {...props}>
      <Grid.Item>
        <Card.Root size="sm" variant="outline">
          <Card.Header>
            <Card.Title>{t("plans.growth.name")}</Card.Title>
            <Card.Description>{t("plans.growth.price")}</Card.Description>
          </Card.Header>
        </Card.Root>
      </Grid.Item>
    </Grid.Root>
  );
}
