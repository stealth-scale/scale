import { type ReactElement } from "react";

import { MoonIcon, SunIcon } from "lucide-react";

import { Group } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { ColorModeToggle } from "#color-mode-toggle/index.ts";

export function Header(): ReactElement {
  const { t } = useWords("color-mode-toggle");

  return (
    <Group align="baseline" justify="between">
      <Text weight="semibold">{t("header.product")}</Text>
      <ColorModeToggle
        dark={<MoonIcon aria-hidden size="1em" />}
        label={t("label")}
        light={<SunIcon aria-hidden size="1em" />}
      />
    </Group>
  );
}
