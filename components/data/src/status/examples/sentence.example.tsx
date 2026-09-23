import { type ReactElement } from "react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Status from "#status/index.ts";

export function Sentence(): ReactElement {
  const { t } = useWords("status");

  return (
    <Text>
      {t("before")}{" "}
      <Status.Root effect="pulse" palette="success" size="inherit">
        <Status.Indicator />
        {t("states.success")}
      </Status.Root>{" "}
      {t("after")}
    </Text>
  );
}
