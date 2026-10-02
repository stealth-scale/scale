import { type ReactElement } from "react";

import { Card } from "@stealthscale/component-surfaces";
import { useWords } from "@stealthscale/specimen";

import * as Grid from "#grid/index.ts";

export function Dashboard(props: Grid.RootProps): ReactElement {
  const { t } = useWords("grid");

  return (
    <Grid.Root columns="3" {...props}>
      <Grid.Item span="2">
        <Card.Root size="sm" variant="outline">
          <Card.Content>{t("widgets.revenue")}</Card.Content>
        </Card.Root>
      </Grid.Item>
      <Grid.Item span="2">
        <Card.Root size="sm" variant="outline">
          <Card.Content>{t("widgets.payouts")}</Card.Content>
        </Card.Root>
      </Grid.Item>
      <Grid.Item>
        <Card.Root size="sm" variant="outline">
          <Card.Content>{t("widgets.disputes")}</Card.Content>
        </Card.Root>
      </Grid.Item>
      <Grid.Item>
        <Card.Root size="sm" variant="outline">
          <Card.Content>{t("widgets.refunds")}</Card.Content>
        </Card.Root>
      </Grid.Item>
    </Grid.Root>
  );
}
