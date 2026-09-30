import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import { NetworkGraph } from "#network-graph/index.ts";

export function Empty(): ReactElement {
  const { t } = useWords("network-graph");

  return (
    <NetworkGraph emptyLabel={t("empty.message")} label={t("empty.label")} links={[]} nodes={[]} />
  );
}
