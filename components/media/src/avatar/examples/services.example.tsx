import { type ReactElement } from "react";

import { BotIcon, WarehouseIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Avatar from "#avatar/index.ts";

export function Services(): ReactElement {
  const { t } = useWords("avatar");

  return (
    <Stack direction="row" gap="md">
      <Avatar.Root name={t("deployBot")} palette="primary" shape="square" variant="solid">
        <Avatar.Fallback>
          <BotIcon />
        </Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root name={t("warehouse")} palette="accent" shape="rounded">
        <Avatar.Fallback>
          <WarehouseIcon />
        </Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root name={t("northwind")} shape="rounded" variant="outline">
        <Avatar.Fallback />
      </Avatar.Root>
    </Stack>
  );
}
