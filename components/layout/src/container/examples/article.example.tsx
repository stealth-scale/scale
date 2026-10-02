import { type ReactElement } from "react";

import { Card } from "@stealthscale/component-surfaces";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Container } from "#container/index.ts";

export function Article(props: Parameters<typeof Container>[0]): ReactElement {
  const { t } = useWords("container");

  return (
    <Container {...props}>
      <Card.Root variant="subtle">
        <Card.Content>
          <Text>{t("payouts")}</Text>
        </Card.Content>
      </Card.Root>
    </Container>
  );
}
