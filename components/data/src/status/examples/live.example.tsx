import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Status from "#status/index.ts";

export function Live(props: Status.RootProps): ReactElement {
  const { t } = useWords("status");

  return (
    <Status.Root {...props}>
      <Status.Indicator />
      {t("states.success")}
    </Status.Root>
  );
}
