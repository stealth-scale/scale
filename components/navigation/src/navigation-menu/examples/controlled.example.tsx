import { type ReactElement, useState } from "react";

import { ChevronDownIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as NavigationMenu from "#navigation-menu/index.ts";

const SECTIONS = [
  { key: "api", links: ["payments", "refunds", "webhooks"] },
  { key: "tools", links: ["cli", "sandbox", "logs"] },
] as const;

export function Controlled(): ReactElement {
  const { t } = useWords("navigation-menu");
  const [value, setValue] = useState("");
  const [picked, setPicked] = useState("");
  const open = SECTIONS.find((section) => section.key === value);
  const status =
    open === undefined
      ? t("controlled.closed")
      : t("controlled.open", { item: t(`inline.${open.key}`) });

  return (
    <Stack direction="row" gap="lg" wrap>
      <NavigationMenu.Root
        aria-label={t("inline.label")}
        onValueChange={(details) => {
          setValue(details.value);
        }}
        value={value}
      >
        <NavigationMenu.List>
          {SECTIONS.map(({ key, links }) => (
            <NavigationMenu.Item key={key} value={key}>
              <NavigationMenu.Trigger>
                {t(`inline.${key}`)}
                <ChevronDownIcon />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content>
                {links.map((link) => (
                  <NavigationMenu.Link
                    href={`#${link}`}
                    key={link}
                    onSelect={() => {
                      setPicked(t(`inline.${link}`));
                    }}
                  >
                    {t(`inline.${link}`)}
                  </NavigationMenu.Link>
                ))}
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>
      </NavigationMenu.Root>
      <Text as="output">
        {picked === "" ? status : `${status} ${t("controlled.picked", { link: picked })}`}
      </Text>
    </Stack>
  );
}
