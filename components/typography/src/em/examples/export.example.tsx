import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Em } from "#em/index.ts";
import { Text } from "#text/index.ts";

export function Export(props: Parameters<typeof Em>[0]): ReactElement {
  const { t } = useWords("em");

  return (
    <Text>
      {t("before")} <Em {...props}>{t("after")}</Em> {t("backup")}
    </Text>
  );
}
