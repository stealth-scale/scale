import { type ReactElement } from "react";

import { ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as JsonTreeView from "#json-tree-view/index.ts";

const DEPLOYMENT = {
  regions: {
    eu: { replicas: 3, zones: ["eu-west-1a", "eu-west-1b"] },
    us: { replicas: 5, zones: ["us-east-1a", "us-east-1c"] },
  },
  service: "payouts",
  version: "2026.09.25",
};

export function Depth(props: Partial<JsonTreeView.RootProps>): ReactElement {
  const { t } = useWords("json-tree-view");

  return (
    <JsonTreeView.Root data={DEPLOYMENT} {...props}>
      <JsonTreeView.Tree aria-label={t("depth.label")} arrow={<ChevronRightIcon />} indentGuide />
    </JsonTreeView.Root>
  );
}
