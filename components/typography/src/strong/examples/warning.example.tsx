import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Strong } from "#strong/index.ts";
import { Text } from "#text/index.ts";

export function Warning(props: Parameters<typeof Strong>[0]): ReactElement {
  const { t } = useWords("strong");

  return (
    <Text>
      {t("subject")} <Strong {...props}>{t("permanent")}</Strong>
    </Text>
  );
}
