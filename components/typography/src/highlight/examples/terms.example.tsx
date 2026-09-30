import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Highlight } from "#highlight/index.ts";
import { Text } from "#text/index.ts";

export function Terms(): ReactElement {
  const { t } = useWords("highlight");

  return (
    <Text>
      <Highlight query={[t("terms.refund"), t("terms.chargeback")]}>{t("terms.text")}</Highlight>
    </Text>
  );
}
