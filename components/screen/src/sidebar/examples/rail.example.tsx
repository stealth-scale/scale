import { type ReactElement } from "react";

import {
  Building2Icon,
  FileTextIcon,
  LayoutDashboardIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";

import { NavList } from "@stealthscale/component-navigation";
import { useWords } from "@stealthscale/specimen";

import * as Sidebar from "#sidebar/index.ts";

const PAGES = [
  ["overview", LayoutDashboardIcon, "page"],
  ["invoices", FileTextIcon, undefined],
  ["customers", UsersIcon, undefined],
] as const;

export function Rail(): ReactElement {
  const { t } = useWords("sidebar");

  return (
    <Sidebar.Root iconic variant="outline">
      <Sidebar.Header>
        <Building2Icon />
        <span>{t("acme")}</span>
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Nav>
          <Sidebar.NavLabel as="h3">{t("workspace")}</Sidebar.NavLabel>
          <NavList.Root>
            {PAGES.map(([page, Glyph, current]) => (
              <NavList.Item key={page}>
                <NavList.Link aria-current={current} href={`#${page}`} tooltip={t(page)}>
                  <Glyph />
                  <span>{t(page)}</span>
                </NavList.Link>
              </NavList.Item>
            ))}
          </NavList.Root>
        </Sidebar.Nav>
      </Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Nav aria-label={t("account")}>
          <NavList.Root>
            <NavList.Item>
              <NavList.Link href="#account" tooltip={t("person")}>
                <UserIcon />
                <span>{t("person")}</span>
              </NavList.Link>
            </NavList.Item>
          </NavList.Root>
        </Sidebar.Nav>
      </Sidebar.Footer>
    </Sidebar.Root>
  );
}
