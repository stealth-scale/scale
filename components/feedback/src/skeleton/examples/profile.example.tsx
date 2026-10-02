import { type ReactElement } from "react";

import { Card } from "@stealthscale/component-surfaces";
import { useWords } from "@stealthscale/specimen";

import { Skeleton } from "#skeleton/index.ts";

export function Profile(props: Parameters<typeof Skeleton>[0]): ReactElement {
  const { t } = useWords("skeleton");

  return (
    <Skeleton {...props}>
      <Card.Root size="sm">
        <Card.Header>
          <Card.Title>{t("name")}</Card.Title>
          <Card.Description>{t("role")}</Card.Description>
        </Card.Header>
      </Card.Root>
    </Skeleton>
  );
}
