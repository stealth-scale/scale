import { type ReactElement } from "react";

import { Badge } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Truncate } from "#truncate/index.ts";

export function Shipment(): ReactElement {
  const { t } = useWords("truncate");

  return (
    <Stack align="baseline" direction="row" gap="md">
      <Truncate>{t("shipment.note")}</Truncate>
      <Badge palette="warning">{t("shipment.status")}</Badge>
    </Stack>
  );
}
