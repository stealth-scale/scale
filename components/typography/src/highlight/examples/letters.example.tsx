import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Highlight, type HighlightProps } from "#highlight/index.ts";
import { Text } from "#text/index.ts";

export function Letters(props: Omit<HighlightProps, "children" | "query">): ReactElement {
  const { t } = useWords("highlight");

  return (
    <Text>
      <Highlight query={t("letters.query")} {...props}>
        {t("letters.text")}
      </Highlight>
    </Text>
  );
}
