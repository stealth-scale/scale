import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import { Stack } from "#stack/index.ts";

export function Actions(props: Parameters<typeof Stack>[0]): ReactElement {
  const { t } = useWords("stack");

  return (
    <Stack {...props}>
      <Button variant="outline">{t("draft")}</Button>
      <Button variant="outline">{t("preview")}</Button>
      <Button>{t("publish")}</Button>
    </Stack>
  );
}
