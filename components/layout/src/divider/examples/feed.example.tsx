import { type ReactElement } from "react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Divider } from "#divider/index.ts";
import { Stack } from "#stack/index.ts";

export function Feed(): ReactElement {
  const { t } = useWords("divider");

  return (
    <Stack gap="md">
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          {t("today")}
        </Text>
        <Text>{t("paid")}</Text>
      </Stack>
      <Divider />
      <Stack gap="xs">
        <Text size="sm" tone="muted">
          {t("yesterday")}
        </Text>
        <Text>{t("refunded")}</Text>
      </Stack>
    </Stack>
  );
}
