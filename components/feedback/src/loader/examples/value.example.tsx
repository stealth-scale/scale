import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Loader } from "#loader/index.ts";

export function Value(): ReactElement {
  const { t } = useWords("loader");

  return (
    <Stack direction="row" gap="xl">
      <Text weight="semibold">
        <Loader loading={false}>{t("settled")}</Loader>
      </Text>
      <Text weight="semibold">
        <Loader loading>{t("settled")}</Loader>
      </Text>
    </Stack>
  );
}
