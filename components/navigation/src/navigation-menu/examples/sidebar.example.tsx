import { type ReactElement } from "react";

import { ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as NavigationMenu from "#navigation-menu/index.ts";

const GROUPS = [
  { key: "billing", links: ["invoices", "subscriptions", "tax"] },
  { key: "settings", links: ["team", "security", "keys"] },
] as const;

export function Sidebar(): ReactElement {
  const { t } = useWords("navigation-menu.sidebar");

  return (
    <NavigationMenu.Root aria-label={t("label")} orientation="vertical">
      <NavigationMenu.List>
        <NavigationMenu.Item value="dashboard">
          <NavigationMenu.Link current href="#dashboard">
            {t("dashboard")}
          </NavigationMenu.Link>
        </NavigationMenu.Item>
        {GROUPS.map(({ key, links }) => (
          <NavigationMenu.Item key={key} value={key}>
            <NavigationMenu.Trigger>
              {t(key)}
              <ChevronRightIcon />
            </NavigationMenu.Trigger>
            <NavigationMenu.Content>
              {links.map((link) => (
                <NavigationMenu.Link href={`#${link}`} key={link}>
                  {t(link)}
                </NavigationMenu.Link>
              ))}
            </NavigationMenu.Content>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
