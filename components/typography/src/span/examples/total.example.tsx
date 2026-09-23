import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Span } from "#span/index.ts";
import { Text } from "#text/index.ts";

export function Total(props: Parameters<typeof Span>[0]): ReactElement {
  const { t } = useWords("span");

  return (
    <Text>
      {t("due")} <Span {...props}>{t("total")}</Span>
    </Text>
  );
}
