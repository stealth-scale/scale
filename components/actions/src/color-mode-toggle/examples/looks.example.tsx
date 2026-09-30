import { type ReactElement } from "react";

import { MoonIcon, SunIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import { ColorModeToggle, type ColorModeToggleProps } from "#color-mode-toggle/index.ts";

export function Looks(props: Partial<ColorModeToggleProps>): ReactElement {
  const { t } = useWords("color-mode-toggle");

  return (
    <ColorModeToggle
      dark={<MoonIcon aria-hidden size="1em" />}
      label={t("label")}
      light={<SunIcon aria-hidden size="1em" />}
      {...props}
    />
  );
}
