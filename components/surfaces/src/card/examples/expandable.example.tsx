import { type ReactElement } from "react";

import { ChevronDownIcon } from "lucide-react";

import { Collapsible } from "@stealthscale/component-disclosure";
import { List } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Card from "#card/index.ts";

export function Expandable(): ReactElement {
  const { t } = useWords("card");
  const transfers = ["first", "second", "third"];

  return (
    <Card.Root aria-label={t("expandable.title")}>
      <Card.Header>
        <Card.Title>{t("expandable.title")}</Card.Title>
        <Card.Description>{t("expandable.amount")}</Card.Description>
      </Card.Header>
      <Card.Content>
        <Collapsible.Root size="sm" variant="subtle">
          <Collapsible.Trigger>
            {t("expandable.show")}
            <Collapsible.Indicator>
              <ChevronDownIcon aria-hidden />
            </Collapsible.Indicator>
          </Collapsible.Trigger>
          <Collapsible.Content>
            <List.Root gap="xs" variant="plain">
              {transfers.map((transfer) => (
                <List.Item key={transfer}>{t(`expandable.transfers.${transfer}`)}</List.Item>
              ))}
            </List.Root>
          </Collapsible.Content>
        </Collapsible.Root>
      </Card.Content>
    </Card.Root>
  );
}
