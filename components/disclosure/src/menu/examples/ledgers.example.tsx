import { type ReactElement } from "react";

import { ChevronDownIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Portal } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/specimen";

import * as Menu from "#menu/index.ts";

const LEDGERS = Array.from({ length: 24 }, (_, index) => String(index + 1).padStart(2, "0"));

export function Ledgers(props: Menu.RootProps): ReactElement {
  const { t } = useWords("menu");

  return (
    <Menu.Root {...props}>
      <Menu.Trigger as={Button}>
        {t("pickLedger")}
        <Menu.Indicator>
          <ChevronDownIcon size="1em" />
        </Menu.Indicator>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {LEDGERS.map((number) => (
              <Menu.Item key={number} value={number}>
                {t("ledger", { number })}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
