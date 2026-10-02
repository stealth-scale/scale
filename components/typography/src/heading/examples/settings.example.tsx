import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Heading } from "#heading/index.ts";

export function Settings(props: Parameters<typeof Heading>[0]): ReactElement {
  const { t } = useWords("heading");

  return (
    <Heading as="h3" {...props}>
      {t("settings")}
    </Heading>
  );
}
