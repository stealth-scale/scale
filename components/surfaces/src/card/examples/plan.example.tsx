import { type ReactElement } from "react";

import { CheckIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Badge } from "@stealthscale/component-data";
import { Heading, List, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Card from "#card/index.ts";

export function Plan(): ReactElement {
  const { t } = useWords("card");
  const features = ["reconcile", "payouts", "exports", "support"];

  return (
    <Card.Root aria-label={t("plan.name")} palette="primary" variant="outline">
      <Card.Header>
        <Card.Title>{t("plan.name")}</Card.Title>
        <Card.Description>{t("plan.for")}</Card.Description>
        <Card.Aside>
          <Badge palette="primary">{t("plan.popular")}</Badge>
        </Card.Aside>
      </Card.Header>
      <Card.Content>
        <Heading as="p" size="2xl">
          {t("plan.price")}
        </Heading>
        <Text size="sm" tone="muted">
          {t("plan.per")}
        </Text>
      </Card.Content>
      <Card.Section>
        <List.Root gap="sm" variant="plain">
          {features.map((feature) => (
            <List.Item key={feature}>
              <List.Indicator>
                <CheckIcon aria-hidden />
              </List.Indicator>
              {t(`plan.features.${feature}`)}
            </List.Item>
          ))}
        </List.Root>
      </Card.Section>
      <Card.Footer>
        <Button>{t("plan.start")}</Button>
      </Card.Footer>
    </Card.Root>
  );
}
