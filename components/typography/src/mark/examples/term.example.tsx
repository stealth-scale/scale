import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Mark } from "#mark/index.ts";

export function Term(props: Parameters<typeof Mark>[0]): ReactElement {
  const { t } = useWords("mark");

  return <Mark {...props}>{t("term")}</Mark>;
}
