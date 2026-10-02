import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Textarea } from "#textarea/index.ts";

export function Capped(props: Parameters<typeof Textarea>[0]): ReactElement {
  const { t } = useWords("textarea");

  return (
    <Textarea aria-label={t("delivery")} defaultValue={t("written")} grows rows={2} {...props} />
  );
}
