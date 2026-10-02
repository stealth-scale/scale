import { type ReactElement } from "react";

import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Switcher from "#switcher/index.ts";

const WORKSPACES = [
  ["ledger", "production"],
  ["northwind", "trial"],
  ["acme", "enterprise"],
] as const;

export function Linked(): ReactElement {
  const { t } = useWords("switcher");

  return (
    <Switcher.Root
      checkIcon={<CheckIcon size="1em" />}
      indicator={<ChevronsUpDownIcon size="1em" />}
      items={WORKSPACES.map(([name, plan]) => ({
        detail: t(plan),
        href: `#${name}`,
        label: t(name),
        value: name,
      }))}
      label={t("workspace")}
      value="northwind"
    >
      <Switcher.Action icon={<PlusIcon size="1em" />}>{t("new")}</Switcher.Action>
    </Switcher.Root>
  );
}
