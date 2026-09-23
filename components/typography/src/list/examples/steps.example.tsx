import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as List from "#list/index.ts";

export function Steps(props: List.RootProps): ReactElement {
  const { t } = useWords("list");

  return (
    <List.Root {...props}>
      <List.Item>{t("steps.verify")}</List.Item>
      <List.Item>{t("steps.connect")}</List.Item>
      <List.Item>{t("steps.invite")}</List.Item>
    </List.Root>
  );
}
