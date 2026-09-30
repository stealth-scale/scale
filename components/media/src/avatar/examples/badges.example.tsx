import { type ReactElement } from "react";

import { BadgeCheckIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Avatar from "#avatar/index.ts";

import ada from "./ada.webp";
import bram from "./bram.webp";
import cleo from "./cleo.webp";
import devi from "./devi.webp";

export function Badges(): ReactElement {
  const { t } = useWords("avatar");

  return (
    <Stack direction="row" gap="xl">
      <Avatar.Root name={t("ada")} size="lg">
        <Avatar.Fallback />
        <Avatar.Image src={ada} />
        <Avatar.Badge label={t("online")} palette="success" />
      </Avatar.Root>
      <Avatar.Root name={t("bram")} size="lg">
        <Avatar.Fallback />
        <Avatar.Image src={bram} />
        <Avatar.Badge label={t("unread")} palette="error" placement="top-end">
          3
        </Avatar.Badge>
      </Avatar.Root>
      <Avatar.Root name={t("cleo")} size="lg">
        <Avatar.Fallback />
        <Avatar.Image src={cleo} />
        <Avatar.Badge label={t("holiday")} variant="subtle">
          🌴
        </Avatar.Badge>
      </Avatar.Root>
      <Avatar.Root name={t("devi")} size="lg">
        <Avatar.Fallback />
        <Avatar.Image src={devi} />
        <Avatar.Badge label={t("verified")} palette="primary">
          <BadgeCheckIcon />
        </Avatar.Badge>
      </Avatar.Root>
    </Stack>
  );
}
