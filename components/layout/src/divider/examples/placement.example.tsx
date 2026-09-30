import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { Divider } from "#divider/index.ts";

export function Placement(props: Parameters<typeof Divider>[0]): ReactElement {
  const { t } = useWords("divider");

  return <Divider label={t("unread")} {...props} />;
}
