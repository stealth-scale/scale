import { type ReactElement } from "react";

import { CreditCardIcon, LockIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { DataList } from "@stealthscale/component-collections";
import { Field, InputGroup } from "@stealthscale/component-forms";
import { Grid, Stack } from "@stealthscale/component-layout";
import { Heading, Span, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as AppShell from "#app-shell/index.ts";
import * as Toolbar from "#toolbar/index.ts";

const ORDER = [
  ["mugs", "£36.00"],
  ["shipping", "£4.00"],
  ["vat", "£8.00"],
] as const;

export function Checkout(props: AppShell.RootProps): ReactElement {
  const { t } = useWords("app-shell");

  return (
    <AppShell.Root {...props}>
      <AppShell.Header>
        <Toolbar.Root aria-label={t("northwind")} size="sm">
          <Toolbar.Start>
            <Text as="span" size="sm" weight="semibold">
              {t("northwind")}
            </Text>
          </Toolbar.Start>
          <Toolbar.End>
            <LockIcon aria-hidden size="1em" />
            <Text as="span" size="sm" tone="muted">
              {t("secure")}
            </Text>
          </Toolbar.End>
        </Toolbar.Root>
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Main>
          <AppShell.Section>
            <Grid.Root columns="fit-xs" gap="xl">
              <Grid.Item>
                <Stack gap="md">
                  <Heading as="h2" size="xs">
                    {t("summary")}
                  </Heading>
                  <DataList.Root divided orientation="horizontal" size="sm">
                    {ORDER.map(([line, amount]) => (
                      <DataList.Item key={line}>
                        <DataList.ItemLabel>{t(line)}</DataList.ItemLabel>
                        <DataList.ItemValue>{amount}</DataList.ItemValue>
                      </DataList.Item>
                    ))}
                    <DataList.Item>
                      <DataList.ItemLabel>{t("total")}</DataList.ItemLabel>
                      <DataList.ItemValue>
                        <Span weight="semibold">£48.00</Span>
                      </DataList.ItemValue>
                    </DataList.Item>
                  </DataList.Root>
                </Stack>
              </Grid.Item>
              <Grid.Item>
                <Stack gap="md">
                  <Heading as="h2" size="xs">
                    {t("payment")}
                  </Heading>
                  <Field.Root size="sm">
                    <Field.Label>{t("email")}</Field.Label>
                    <Field.Control autoComplete="email" type="email" />
                  </Field.Root>
                  <InputGroup.Root size="sm">
                    <InputGroup.Row>
                      <InputGroup.Mark aria-hidden>
                        <CreditCardIcon />
                      </InputGroup.Mark>
                      <InputGroup.Field
                        aria-label={t("card")}
                        autoComplete="cc-number"
                        inputMode="numeric"
                        placeholder="1234 1234 1234 1234"
                      />
                    </InputGroup.Row>
                    <InputGroup.Row>
                      <InputGroup.Field
                        aria-label={t("expiry")}
                        autoComplete="cc-exp"
                        inputMode="numeric"
                        placeholder="MM / YY"
                      />
                      <InputGroup.Field
                        aria-label={t("code")}
                        autoComplete="cc-csc"
                        inputMode="numeric"
                        placeholder="CVC"
                      />
                    </InputGroup.Row>
                  </InputGroup.Root>
                  <Button size="sm">{t("pay")}</Button>
                </Stack>
              </Grid.Item>
            </Grid.Root>
          </AppShell.Section>
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}
