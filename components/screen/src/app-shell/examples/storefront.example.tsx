import { type ReactElement } from "react";

import { SearchIcon, ShoppingBagIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Grid } from "@stealthscale/component-layout";
import { Card } from "@stealthscale/component-surfaces";
import { Heading, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as AppShell from "#app-shell/index.ts";
import * as Toolbar from "#toolbar/index.ts";

const PRODUCTS = [
  ["mug", "£18.00"],
  ["bowl", "£24.00"],
  ["plate", "£16.00"],
  ["jug", "£32.00"],
  ["vase", "£45.00"],
  ["teapot", "£58.00"],
] as const;

export function Storefront(props: AppShell.RootProps): ReactElement {
  const { t } = useWords("app-shell");

  return (
    <AppShell.Root scroll="window" {...props}>
      <AppShell.Header sticky>
        <Toolbar.Root aria-label={t("northwind")} size="sm">
          <Toolbar.Start>
            <Text as="span" size="sm" weight="semibold">
              {t("northwind")}
            </Text>
          </Toolbar.Start>
          <Toolbar.End>
            <Toolbar.Search
              aria-label={t("searchProducts")}
              placeholder={t("searchProducts")}
              searchIndicator={<SearchIcon />}
            />
            <Toolbar.Action icon={<ShoppingBagIcon />}>{t("basket")}</Toolbar.Action>
          </Toolbar.End>
        </Toolbar.Root>
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Main>
          <AppShell.Section>
            <Heading as="h2" size="sm">
              {t("newIn")}
            </Heading>
            <Grid.Root columns="fit-xs" gap="md">
              {PRODUCTS.map(([product, price]) => (
                <Grid.Item key={product}>
                  <Card.Root justify="between" size="sm" variant="outline">
                    <Card.Header>
                      <Card.Title>{t(product)}</Card.Title>
                      <Card.Description>{t(`${product}About`)}</Card.Description>
                    </Card.Header>
                    <Card.Footer>
                      <Text as="span" size="sm" weight="semibold">
                        {price}
                      </Text>
                      <Button size="xs" variant="outline">
                        {t("add")}
                      </Button>
                    </Card.Footer>
                  </Card.Root>
                </Grid.Item>
              ))}
            </Grid.Root>
          </AppShell.Section>
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}
