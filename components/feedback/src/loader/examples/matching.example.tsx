import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Loader } from "#loader/index.ts";

export function Matching(props: Omit<Parameters<typeof Loader>[0], "text">): ReactElement {
  const { t } = useWords("loader");

  return <Loader text={t("matching")} {...props} />;
}
