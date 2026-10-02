import { type ReactElement } from "react";

import { Card } from "@stealthscale/component-surfaces";
import { useWords } from "@stealthscale/specimen";

import * as Grid from "#grid/index.ts";

const PLANS = ["starter", "growth", "scale"] as const;

export function Plans(props: Grid.RootProps): ReactElement {
  const { t } = useWords("grid");

  return (
    <Grid.Root {...props}>
      {PLANS.map((plan) => (
        <Grid.Item key={plan}>
          <Card.Root size="sm" variant="outline">
            <Card.Header>
              <Card.Title>{t(`plans.${plan}.name`)}</Card.Title>
              <Card.Description>{t(`plans.${plan}.price`)}</Card.Description>
            </Card.Header>
          </Card.Root>
        </Grid.Item>
      ))}
    </Grid.Root>
  );
}
