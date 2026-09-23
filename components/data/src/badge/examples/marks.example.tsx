import { type ReactElement } from "react";

import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Badge } from "#badge/index.ts";

export function Marks(): ReactElement {
  const { t } = useWords("badge");

  return (
    <Stack direction="row" gap="sm" wrap>
      <Badge palette="info">
        <InfoIcon aria-hidden />
        {t("sent")}
      </Badge>
      <Badge palette="success">
        <CircleCheckIcon aria-hidden />
        {t("paid")}
      </Badge>
      <Badge palette="warning">
        <TriangleAlertIcon aria-hidden />
        {t("due")}
      </Badge>
      <Badge palette="error">
        <CircleAlertIcon aria-hidden />
        {t("overdue")}
      </Badge>
    </Stack>
  );
}
