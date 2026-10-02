import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import { Stack } from "#stack/index.ts";

export function Wizard(props: Parameters<typeof Stack>[0]): ReactElement {
  const { t } = useWords("stack");

  return (
    <Stack direction="row" {...props}>
      <Button variant="outline">{t("back")}</Button>
      <Button variant="outline">{t("skip")}</Button>
      <Button>{t("next")}</Button>
    </Stack>
  );
}
