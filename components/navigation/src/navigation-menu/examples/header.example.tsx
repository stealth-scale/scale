import { type ReactElement, type ReactNode } from "react";

import {
  BookOpenIcon,
  ChartColumnIcon,
  ChevronDownIcon,
  CreditCardIcon,
  ReceiptTextIcon,
} from "lucide-react";

import { Grid } from "@stealthscale/component-layout";
import { Span, Strong } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as NavigationMenu from "#navigation-menu/index.ts";

const PRODUCTS = [
  { icon: CreditCardIcon, key: "payments" },
  { icon: ReceiptTextIcon, key: "invoicing" },
  { icon: BookOpenIcon, key: "ledger" },
  { icon: ChartColumnIcon, key: "reports" },
] as const;

const RESOURCES = ["guides", "reference", "changelog"] as const;

const COMPANY = ["story", "careers", "contact"] as const;

function panel(value: string, label: string, links: ReactNode): ReactElement {
  return (
    <NavigationMenu.Item value={value}>
      <NavigationMenu.Trigger>
        {label}
        <ChevronDownIcon />
      </NavigationMenu.Trigger>
      <NavigationMenu.Content>{links}</NavigationMenu.Content>
    </NavigationMenu.Item>
  );
}

export function Header(props: NavigationMenu.RootProps): ReactElement {
  const { t } = useWords("navigation-menu.header");

  return (
    <NavigationMenu.Root aria-label={t("label")} {...props}>
      <NavigationMenu.List>
        {panel(
          "products",
          t("products"),
          <Grid.Root columns="2" gap="xs">
            {PRODUCTS.map(({ icon: Icon, key }) => (
              <NavigationMenu.Link href={`#${key}`} key={key}>
                <Icon />
                <Strong weight="medium">{t(`${key}.title`)}</Strong>
                <Span tone="muted">{t(`${key}.about`)}</Span>
              </NavigationMenu.Link>
            ))}
          </Grid.Root>,
        )}
        {panel(
          "resources",
          t("resources"),
          RESOURCES.map((key) => (
            <NavigationMenu.Link href={`#${key}`} key={key}>
              <Strong weight="medium">{t(`${key}.title`)}</Strong>
              <Span tone="muted">{t(`${key}.about`)}</Span>
            </NavigationMenu.Link>
          )),
        )}
        {panel(
          "company",
          t("company"),
          COMPANY.map((key) => (
            <NavigationMenu.Link href={`#${key}`} key={key}>
              {t(key)}
            </NavigationMenu.Link>
          )),
        )}
        <NavigationMenu.Item value="pricing">
          <NavigationMenu.Link current href="#pricing">
            {t("pricing")}
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        <NavigationMenu.Indicator />
      </NavigationMenu.List>
      <NavigationMenu.ViewportPositioner align="start">
        <NavigationMenu.Viewport />
      </NavigationMenu.ViewportPositioner>
    </NavigationMenu.Root>
  );
}
