import { type ReactElement } from "react";

import { Button } from "@stealthscale/component-actions";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Stack } from "#stack/index.ts";

export function Invoice(props: Parameters<typeof Stack>[0]): ReactElement {
  const { t } = useWords("stack");

  return (
    <Stack direction="row" {...props}>
      <Text truncate>{t("invoice")}</Text>
      <Button size="sm">{t("pay")}</Button>
    </Stack>
  );
}
