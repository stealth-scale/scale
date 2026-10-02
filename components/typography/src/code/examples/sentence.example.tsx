import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Code } from "#code/index.ts";
import { Text } from "#text/index.ts";

export function Sentence(): ReactElement {
  const { t } = useWords("code");

  return (
    <Text>
      {t("run")} <Code>pnpm add @stealthscale/theme</Code> {t("where")}
    </Text>
  );
}
