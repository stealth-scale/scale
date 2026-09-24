import { type ReactElement } from "react";

import { CreditCardIcon, PlusIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Divider, Stack } from "@stealthscale/component-layout";
import { Icon, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Section from "#section/index.ts";

const CARDS = [
  ["visa", "7732", "04 / 27"],
  ["mastercard", "4419", "11 / 26"],
] as const;

export function Payment(props: Section.RootProps): ReactElement {
  const { t } = useWords("section");

  return (
    <Section.Root {...props}>
      <Section.Header>
        <Section.Title as="h3">{t("payment")}</Section.Title>
        <Section.Description>{t("cards")}</Section.Description>
        <Section.Actions>
          <ButtonPropsProvider value={{ variant: "subtle" }}>
            <Section.Action as={Button} priority="secondary">
              <PlusIcon size="1em" />
              <span>{t("add")}</span>
            </Section.Action>
          </ButtonPropsProvider>
        </Section.Actions>
      </Section.Header>
      <Section.Body>
        <Stack gap="sm">
          {CARDS.map(([card, digits, expiry], at) => (
            <Stack gap="sm" key={card}>
              {at === 0 ? null : <Divider />}
              <Stack direction="row" justify="between">
                <Stack direction="row" gap="md">
                  <Icon size="lg" tone="muted">
                    <CreditCardIcon />
                  </Icon>
                  <Stack gap="xs">
                    <Text>{t("ending", { card: t(card), digits })}</Text>
                    <Text size="sm" tone="muted">
                      {t("expires", { expiry })}
                    </Text>
                  </Stack>
                </Stack>
                <Button variant="ghost">{t("change")}</Button>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Section.Body>
    </Section.Root>
  );
}
