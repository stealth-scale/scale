import { type ReactElement } from "react";

import { Card } from "@stealthscale/component-surfaces";
import { useWords } from "@stealthscale/specimen";

import * as Grid from "#grid/index.ts";

export function Notes(props: Grid.RootProps): ReactElement {
  const { t } = useWords("grid");

  return (
    <Grid.Root columns="3" {...props}>
      <Card.Root as={Grid.Item} size="sm" variant="outline">
        <Card.Content>{t("notes.paid")}</Card.Content>
      </Card.Root>
      <Card.Root as={Grid.Item} size="sm" variant="outline">
        <Card.Content>{t("notes.overdue")}</Card.Content>
      </Card.Root>
    </Grid.Root>
  );
}
