import { type ReactElement } from "react";

import {
  ArchiveIcon,
  CreditCardIcon,
  ReceiptIcon,
  SearchIcon,
  SettingsIcon,
  TrendingUpIcon,
  UserCheckIcon,
} from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { NavList } from "@stealthscale/component-navigation";
import { useWords } from "@stealthscale/specimen";

import * as Sidebar from "#sidebar/index.ts";

const SIZES = [
  {
    label: "reports",
    pages: [
      ["revenue", TrendingUpIcon],
      ["expenses", ReceiptIcon],
    ],
    size: "sm",
  },
  {
    label: "customers",
    pages: [
      ["active", UserCheckIcon],
      ["archived", ArchiveIcon],
    ],
    size: "md",
  },
  {
    label: "settings",
    pages: [
      ["general", SettingsIcon],
      ["billing", CreditCardIcon],
    ],
    size: "lg",
  },
] as const;

export function Sizes(): ReactElement {
  const { t } = useWords("sidebar");

  return (
    <Stack gap="lg">
      {SIZES.map(({ label, pages, size }) => (
        <Sidebar.Root key={size} size={size} variant="outline">
          <Sidebar.Header>
            <span>{t("acme")}</span>
            <Sidebar.Search
              aria-label={t("findPage")}
              placeholder={t("filter")}
              searchIndicator={<SearchIcon />}
            />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Nav>
              <Sidebar.NavLabel as="h3">{t(label)}</Sidebar.NavLabel>
              <NavList.Root>
                {pages.map(([page, Glyph], at) => (
                  <NavList.Item key={page}>
                    <NavList.Link aria-current={at === 0 ? "page" : undefined} href={`#${page}`}>
                      <Glyph />
                      <span>{t(page)}</span>
                    </NavList.Link>
                  </NavList.Item>
                ))}
              </NavList.Root>
            </Sidebar.Nav>
          </Sidebar.Content>
        </Sidebar.Root>
      ))}
    </Stack>
  );
}
