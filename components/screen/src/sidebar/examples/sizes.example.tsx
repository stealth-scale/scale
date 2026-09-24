import { type ReactElement } from "react";

import {
  ArchiveIcon,
  Building2Icon,
  CircleUserIcon,
  CreditCardIcon,
  ReceiptIcon,
  SearchIcon,
  SettingsIcon,
  TrendingUpIcon,
  UserCheckIcon,
} from "lucide-react";

import { SearchInput } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { NavList } from "@stealthscale/component-navigation";
import { useWords } from "@stealthscale/specimen";

import * as Sidebar from "#sidebar/index.ts";

const SIZES = [
  {
    field: "xs",
    label: "reports",
    pages: [
      ["revenue", TrendingUpIcon],
      ["expenses", ReceiptIcon],
    ],
    size: "sm",
  },
  {
    field: "sm",
    label: "customers",
    pages: [
      ["active", UserCheckIcon],
      ["archived", ArchiveIcon],
    ],
    size: "md",
  },
  {
    field: "md",
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
      {SIZES.map(({ field, label, pages, size }) => (
        <Sidebar.Root key={size} size={size} variant="outline">
          <Sidebar.Header>
            <Building2Icon />
            <span>{t("acme")}</span>
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Search>
              <SearchInput aria-label={t("search")} searchIndicator={<SearchIcon />} size={field} />
            </Sidebar.Search>
            <Sidebar.Nav>
              <Sidebar.NavLabel as="h3">{t(label)}</Sidebar.NavLabel>
              <NavList.Root size={size}>
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
          <Sidebar.Footer>
            <CircleUserIcon />
            <span>{t("signedIn")}</span>
          </Sidebar.Footer>
        </Sidebar.Root>
      ))}
    </Stack>
  );
}
