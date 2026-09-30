import { type ReactElement } from "react";

import {
  ChevronRightIcon,
  CreditCardIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  PencilIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as NavList from "#nav-list/index.ts";

export function Workspace(props: NavList.RootProps): ReactElement {
  const { t } = useWords("nav-list");

  return (
    <NavList.Root {...props}>
      <NavList.Item>
        <NavList.Link aria-current="page" href="#overview" tooltip={t("overview")}>
          <LayoutDashboardIcon aria-hidden />
          <span>{t("overview")}</span>
        </NavList.Link>
        <NavList.Badge>3</NavList.Badge>
      </NavList.Item>
      <NavList.Item>
        <NavList.Link href="#invoices" tooltip={t("invoices")}>
          <FileTextIcon aria-hidden />
          <span>{t("invoices")}</span>
        </NavList.Link>
        <NavList.Action aria-label={t("rename", { name: t("invoices") })}>
          <PencilIcon aria-hidden size="1em" />
        </NavList.Action>
      </NavList.Item>
      <NavList.Branch defaultOpen>
        <NavList.Trigger>
          <SettingsIcon aria-hidden />
          <span>{t("settings")}</span>
          <NavList.Indicator>
            <ChevronRightIcon aria-hidden size="1em" />
          </NavList.Indicator>
        </NavList.Trigger>
        <NavList.Content>
          <NavList.Item>
            <NavList.Link href="#team">
              <UsersIcon aria-hidden />
              <span>{t("team")}</span>
            </NavList.Link>
          </NavList.Item>
          <NavList.Item>
            <NavList.Link href="#billing">
              <CreditCardIcon aria-hidden />
              <span>{t("billing")}</span>
            </NavList.Link>
          </NavList.Item>
        </NavList.Content>
      </NavList.Branch>
    </NavList.Root>
  );
}
