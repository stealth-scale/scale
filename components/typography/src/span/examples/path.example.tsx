import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Span } from "#span/index.ts";
import { Text } from "#text/index.ts";

export function Path(props: Parameters<typeof Span>[0]): ReactElement {
  const { t } = useWords("span");

  return (
    <Text>
      <Span {...props}>{t("path")}</Span>
    </Text>
  );
}
