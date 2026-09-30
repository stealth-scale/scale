import { type ReactElement } from "react";

import { ChevronDownIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as NavigationMenu from "#navigation-menu/index.ts";

const SECTIONS = [
  { key: "api", links: ["payments", "refunds", "webhooks"] },
  { key: "tools", links: ["cli", "sandbox", "logs"] },
] as const;

export function Aligned(props: NavigationMenu.ViewportPositionerProps): ReactElement {
  const { t } = useWords("navigation-menu.inline");

  return (
    <NavigationMenu.Root aria-label={t("label")}>
      <NavigationMenu.List>
        {SECTIONS.map(({ key, links }) => (
          <NavigationMenu.Item key={key} value={key}>
            <NavigationMenu.Trigger>
              {t(key)}
              <ChevronDownIcon />
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
        <NavigationMenu.Indicator />
      </NavigationMenu.List>
      <NavigationMenu.ViewportPositioner {...props}>
        <NavigationMenu.Viewport />
      </NavigationMenu.ViewportPositioner>
    </NavigationMenu.Root>
  );
}
