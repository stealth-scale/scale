import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Quote } from "#quote/index.ts";
import { Text } from "#text/index.ts";

export function Audit(props: Parameters<typeof Quote>[0]): ReactElement {
  const { t } = useWords("quote");

  return (
    <Text>
      {t("before")} <Quote {...props}>{t("claim")}</Quote>
      {t("after")}
    </Text>
  );
}
