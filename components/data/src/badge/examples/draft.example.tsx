import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Badge } from "#badge/index.ts";

export function Draft(props: Parameters<typeof Badge>[0]): ReactElement {
  const { t } = useWords("badge");

  return <Badge {...props}>{t("draft")}</Badge>;
}
