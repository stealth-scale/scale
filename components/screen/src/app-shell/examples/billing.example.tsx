import { type ReactElement } from "react";

import {
  ChartColumnIcon,
  CreditCardIcon,
  InfoIcon,
  LayoutDashboardIcon,
  MenuIcon,
  ReceiptIcon,
} from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Alert, EmptyState } from "@stealthscale/component-feedback";
import { NavList } from "@stealthscale/component-navigation";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as AppShell from "#app-shell/index.ts";
import * as Sidebar from "#sidebar/index.ts";
import * as Toolbar from "#toolbar/index.ts";

const PAGES = [
  ["overview", LayoutDashboardIcon, undefined],
  ["invoices", ReceiptIcon, "page"],
  ["usage", ChartColumnIcon, undefined],
  ["plan", CreditCardIcon, undefined],
] as const;

export function Billing(props: AppShell.RootProps): ReactElement {
  const { t } = useWords("app-shell");

  return (
    <AppShell.Root {...props}>
      <AppShell.Header as="div">
        <Alert.Root layout="inline" size="sm">
          <Alert.Indicator>
            <InfoIcon />
          </Alert.Indicator>
          <Alert.Content>
            <Alert.Description>{t("trialEnds")}</Alert.Description>
          </Alert.Content>
          <Alert.Aside>
            <Button size="xs" variant="outline">
              {t("choosePlan")}
            </Button>
          </Alert.Aside>
        </Alert.Root>
      </AppShell.Header>
      <AppShell.Header>
        <Toolbar.Root aria-label={t("billingBrand")} size="sm">
          <Toolbar.Start>
            <Toolbar.Item aria-label={t("navigation")} as={AppShell.Trigger} shape="square">
              <MenuIcon />
            </Toolbar.Item>
            <Text as="span" size="sm" weight="semibold">
              {t("billingBrand")}
            </Text>
          </Toolbar.Start>
          <Toolbar.End>
            <Toolbar.Action primary>{t("addCard")}</Toolbar.Action>
          </Toolbar.End>
        </Toolbar.Root>
      </AppShell.Header>
      <AppShell.Body>
        <AppShell.Navbar foldsBelow="sm" width="11rem">
          <Sidebar.Root variant="subtle">
            <Sidebar.Content>
              <Sidebar.Nav aria-label={t("billingBrand")}>
                <NavList.Root>
                  {PAGES.map(([page, Glyph, current]) => (
                    <NavList.Item key={page}>
                      <NavList.Link aria-current={current} href={`#${page}`}>
                        <Glyph />
                        <span>{t(page)}</span>
                      </NavList.Link>
                    </NavList.Item>
                  ))}
                </NavList.Root>
              </Sidebar.Nav>
            </Sidebar.Content>
          </Sidebar.Root>
        </AppShell.Navbar>
        <AppShell.Main>
          <EmptyState.Root size="sm">
            <EmptyState.Content>
              <EmptyState.Indicator>
                <ReceiptIcon />
              </EmptyState.Indicator>
              <EmptyState.Title as="h2">{t("noInvoices")}</EmptyState.Title>
              <EmptyState.Description>{t("invoicesAppear")}</EmptyState.Description>
            </EmptyState.Content>
          </EmptyState.Root>
        </AppShell.Main>
      </AppShell.Body>
    </AppShell.Root>
  );
}
