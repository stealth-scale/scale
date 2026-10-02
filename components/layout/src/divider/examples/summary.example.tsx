import { type ReactElement } from "react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Divider } from "#divider/index.ts";
import { Group } from "#group/index.ts";
import { Stack } from "#stack/index.ts";

export function Summary(): ReactElement {
  const { t } = useWords("divider");

  return (
    <Stack gap="sm">
      <Group justify="between">
        <Text>{t("subtotal")}</Text>
        <Text>{t("subtotalAmount")}</Text>
      </Group>
      <Group justify="between">
        <Text>{t("vat")}</Text>
        <Text>{t("vatAmount")}</Text>
      </Group>
      <Divider />
      <Group justify="between">
        <Text weight="semibold">{t("total")}</Text>
        <Text weight="semibold">{t("totalAmount")}</Text>
      </Group>
    </Stack>
  );
}
