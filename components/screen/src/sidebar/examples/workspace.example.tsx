import { type ReactElement } from "react";

import { FileTextIcon, LayoutDashboardIcon, UserIcon, UsersIcon } from "lucide-react";

import { NavList } from "@stealthscale/component-navigation";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Sidebar from "#sidebar/index.ts";

export function Workspace(props: Sidebar.RootProps): ReactElement {
  const { t } = useWords("sidebar");

  return (
    <Sidebar.Root {...props}>
      <Sidebar.Header>
        <Text as="p" size="sm" truncate weight="medium">
          {t("acme")}{" "}
          <Text as="span" size="sm" tone="subtle" weight="normal">
            {t("production")}
          </Text>
        </Text>
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Nav>
          <Sidebar.NavLabel as="h3">{t("workspace")}</Sidebar.NavLabel>
          <NavList.Root>
            <NavList.Item>
              <NavList.Link aria-current="page" href="#overview">
                <LayoutDashboardIcon />
                <span>{t("overview")}</span>
              </NavList.Link>
            </NavList.Item>
            <NavList.Item>
              <NavList.Link href="#invoices">
                <FileTextIcon />
                <span>{t("invoices")}</span>
              </NavList.Link>
              <NavList.Badge>3</NavList.Badge>
            </NavList.Item>
            <NavList.Item>
              <NavList.Link href="#customers">
                <UsersIcon />
                <span>{t("customers")}</span>
              </NavList.Link>
            </NavList.Item>
          </NavList.Root>
        </Sidebar.Nav>
      </Sidebar.Content>
      <Sidebar.Footer>
        <Sidebar.Nav aria-label={t("account")}>
          <NavList.Root>
            <NavList.Item>
              <NavList.Link href="#account">
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
