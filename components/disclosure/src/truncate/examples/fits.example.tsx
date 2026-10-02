import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Truncate } from "#truncate/index.ts";

export function Fits(): ReactElement {
  const { t } = useWords("truncate");

  return <Truncate focusable>{t("fits.name")}</Truncate>;
}
