import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Loader } from "#loader/index.ts";

export function Placements(): ReactElement {
  const { t } = useWords("loader");

  return (
    <Stack align="flex-start" direction="column" gap="md">
      <Loader placement="start" text={t("matching")} />
      <Loader placement="end" text={t("matching")} />
    </Stack>
  );
}
