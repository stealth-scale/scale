import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Avatar from "#avatar/index.ts";

export function Presence(props: Avatar.RootProps): ReactElement {
  const { t } = useWords("avatar");

  return (
    <Avatar.Root name={t("ada")} {...props}>
      <Avatar.Fallback />
      <Avatar.Badge label={t("online")} palette="success" />
    </Avatar.Root>
  );
}
