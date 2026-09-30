import { type ReactElement } from "react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Divider } from "#divider/index.ts";
import { Stack } from "#stack/index.ts";

export function Feed(): ReactElement {
  const { t } = useWords("divider");

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <Divider label={t("today")} labelPlacement="start" />
        <Text>{t("paid")}</Text>
      </Stack>
      <Stack gap="xs">
        <Divider label={t("yesterday")} labelPlacement="start" />
        <Text>{t("refunded")}</Text>
      </Stack>
    </Stack>
  );
}
