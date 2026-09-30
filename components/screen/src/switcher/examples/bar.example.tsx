import { type ReactElement } from "react";

import { CheckIcon, ChevronsUpDownIcon, PlayIcon } from "lucide-react";

import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Switcher from "#switcher/index.ts";
import * as Toolbar from "#toolbar/index.ts";

const WORKSPACES = [
  ["ledger", "production"],
  ["northwind", "trial"],
  ["acme", "enterprise"],
] as const;

export function Bar(): ReactElement {
  const { t } = useWords("switcher");

  return (
    <Toolbar.Root aria-label={t("application")} size="sm">
      <Toolbar.Start>
        <Switcher.Root
          checkIcon={<CheckIcon size="1em" />}
          indicator={<ChevronsUpDownIcon size="1em" />}
          items={WORKSPACES.map(([name, plan]) => ({
            detail: t(plan),
            label: t(name),
            value: name,
          }))}
          label={t("workspace")}
        />
      </Toolbar.Start>
      <Toolbar.Center>
        <Text as="span" size="sm" weight="medium">
          {t("runs")}
        </Text>
      </Toolbar.Center>
      <Toolbar.End>
        <Toolbar.Action icon={<PlayIcon size="1em" />} primary>
          {t("newRun")}
        </Toolbar.Action>
      </Toolbar.End>
    </Toolbar.Root>
  );
}
