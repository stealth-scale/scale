import { type ReactElement } from "react";

import { ChevronRightIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as JsonTreeView from "#json-tree-view/index.ts";

const CONFIG = {
  api_key: "sk_live_51Hx9aQ2b8Zk",
  endpoint: "https://api.northwind.example/v1",
  retries: 3,
  timeout_ms: 8000,
  webhook_secret: "whsec_8Jd2kLm4",
};

const SECRET = /key|secret|token/u;

function masked(node: JsonTreeView.JsonNode): string | undefined {
  const value: unknown = node.value;

  if (typeof value !== "string" || !SECRET.test(String(node.keyPath.at(-1)))) return undefined;

  return `"${value.slice(0, value.lastIndexOf("_") + 1)}••••${value.slice(-4)}"`;
}

export function Secrets(): ReactElement {
  const { t } = useWords("json-tree-view");

  return (
    <JsonTreeView.Root data={CONFIG}>
      <JsonTreeView.Tree
        aria-label={t("secrets.label")}
        arrow={<ChevronRightIcon />}
        indentGuide
        renderValue={masked}
      />
    </JsonTreeView.Root>
  );
}
