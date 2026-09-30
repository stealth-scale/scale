import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Avatar from "#avatar/index.ts";

import bram from "./bram.webp";

export function Badged(props: Avatar.BadgeProps): ReactElement {
  const { t } = useWords("avatar");

  return (
    <Avatar.Root name={t("bram")} size="lg">
      <Avatar.Fallback />
      <Avatar.Image src={bram} />
      <Avatar.Badge label={t("unread")} {...props}>
        3
      </Avatar.Badge>
    </Avatar.Root>
  );
}
