import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Text } from "#text/index.ts";

export function Release(props: Parameters<typeof Text>[0]): ReactElement {
  const { t } = useWords("text");

  return <Text {...props}>{t("release")}</Text>;
}
