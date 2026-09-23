import { type ReactElement } from "react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { ColorSwatch } from "#color-swatch/index.ts";

export function Sentence(): ReactElement {
  const { t } = useWords("color-swatch");

  return (
    <Text>
      {t("before")} <ColorSwatch size="inherit" value="#D72323" /> {t("after")}
    </Text>
  );
}
