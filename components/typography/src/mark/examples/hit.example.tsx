import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Mark } from "#mark/index.ts";
import { Text } from "#text/index.ts";

export function Hit(props: Parameters<typeof Mark>[0]): ReactElement {
  const { t } = useWords("mark");

  return (
    <Text>
      {t("found")} <Mark {...props}>{t("term")}</Mark> {t("files")}
    </Text>
  );
}
