import { type ReactElement } from "react";

import { Card } from "@stealthscale/component-surfaces";
import { useWords } from "@stealthscale/specimen";

import * as Grid from "#grid/index.ts";

const STATUSES = ["paid", "pending", "overdue"] as const;

export function Statuses(props: Grid.RootProps): ReactElement {
  const { t } = useWords("grid");

  return (
    <Grid.Root columns="3" {...props}>
      {STATUSES.map((status) => (
        <Card.Root as={Grid.Item} key={status} size="sm" variant="outline">
          <Card.Content>{t(`statuses.${status}`)}</Card.Content>
        </Card.Root>
      ))}
    </Grid.Root>
  );
}
