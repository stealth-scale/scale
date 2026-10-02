import { type ReactElement } from "react";

import { Building2Icon, CheckIcon, ChevronsUpDownIcon, PlusIcon, SettingsIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Switcher from "#switcher/index.ts";

export function Workspaces(props: Switcher.RootProps): ReactElement {
  const { t } = useWords("switcher");
  const workspaces: Switcher.Choice[] = [
    { detail: t("production"), label: t("ledger"), value: "ledger" },
    { detail: t("trial"), label: t("northwind"), value: "northwind" },
    {
      detail: t("enterprise"),
      label: t("acme"),
      mark: <Building2Icon size="1em" />,
      value: "acme",
    },
    { detail: t("suspended"), disabled: true, label: t("oldBooks"), value: "oldBooks" },
  ];

  return (
    <Switcher.Root
      checkIcon={<CheckIcon size="1em" />}
      indicator={<ChevronsUpDownIcon size="1em" />}
      items={workspaces}
      label={t("workspace")}
      {...props}
    >
      <Switcher.Action icon={<PlusIcon size="1em" />}>{t("new")}</Switcher.Action>
      <Switcher.Action icon={<SettingsIcon size="1em" />}>{t("settings")}</Switcher.Action>
    </Switcher.Root>
  );
}
