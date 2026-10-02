import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Button } from "#button/index.ts";

export function Publish(props: Parameters<typeof Button>[0]): ReactElement {
  const { t } = useWords("button");

  return <Button {...props}>{t("publish")}</Button>;
}
