import { type ReactElement } from "react";

import { ChevronDownIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as NavigationMenu from "#navigation-menu/index.ts";

const MENUS = [
  { key: "workspace", links: ["switch", "members", "settings"] },
  { key: "help", links: ["docs", "shortcuts", "support"] },
] as const;

export function Click(): ReactElement {
  const { t } = useWords("navigation-menu.click");

  return (
    <NavigationMenu.Root aria-label={t("label")} disableHoverTrigger disablePointerLeaveClose>
      <NavigationMenu.List>
        {MENUS.map(({ key, links }) => (
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
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
