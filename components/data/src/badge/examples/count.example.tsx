import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Badge } from "#badge/index.ts";

export function Count(props: Parameters<typeof Badge>[0]): ReactElement {
  const { t } = useWords("badge");

  return (
    <Badge aria-label={t("failed", { count: 12 })} {...props}>
      12
    </Badge>
  );
}
