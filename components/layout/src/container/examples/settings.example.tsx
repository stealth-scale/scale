import { type ReactElement } from "react";

import { Card } from "@stealthscale/component-surfaces";
import { useWords } from "@stealthscale/specimen";

import { Container } from "#container/index.ts";

export function Settings(props: Parameters<typeof Container>[0]): ReactElement {
  const { t } = useWords("container");

  return (
    <Container size="sm" {...props}>
      <Card.Root size="sm" variant="outline">
        <Card.Header>
          <Card.Title>{t("settings.title")}</Card.Title>
          <Card.Description>{t("settings.description")}</Card.Description>
        </Card.Header>
      </Card.Root>
    </Container>
  );
}
