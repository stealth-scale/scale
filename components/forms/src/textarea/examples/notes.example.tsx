import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Textarea } from "#textarea/index.ts";

export function Notes(props: Parameters<typeof Textarea>[0]): ReactElement {
  const { t } = useWords("textarea");

  return <Textarea aria-label={t("notes")} placeholder={t("prompt")} {...props} />;
}
