import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Truncate, type TruncateProps } from "#truncate/index.ts";

export function Description(props: Omit<TruncateProps, "children">): ReactElement {
  const { t } = useWords("truncate");

  return <Truncate {...props}>{t("description.text")}</Truncate>;
}
