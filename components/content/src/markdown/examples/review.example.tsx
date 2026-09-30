import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Markdown } from "#markdown/index.ts";

export function Review(): ReactElement {
  const { t } = useWords("markdown");

  return <Markdown headingLevel={3} size="sm" source={t("review.source")} />;
}
