import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Avatar from "#avatar/index.ts";

export function Person(props: Avatar.RootProps): ReactElement {
  const { t } = useWords("avatar");

  return (
    <Avatar.Root name={t("ada")} {...props}>
      <Avatar.Fallback />
    </Avatar.Root>
  );
}
