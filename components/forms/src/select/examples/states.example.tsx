import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { useListCollection } from "@stealthscale/component-collections";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Select from "#select/index.ts";

interface Account {
  readonly id: string;
  readonly name: string;
}

const STATES = ["disabled", "readOnly", "invalid"] as const;

export function States(): ReactElement {
  const { t } = useWords("select");
  const { collection } = useListCollection<Account>({
    itemToString: (account) => account.name,
    itemToValue: (account) => account.id,
    rows: [{ id: "bridge", name: t("accounts.bridge") }],
  });

  return (
    <Stack gap="md">
      {STATES.map((state) => (
        <Select.Root
          collection={collection}
          defaultValue={["bridge"]}
          disabled={state === "disabled"}
          invalid={state === "invalid"}
          key={state}
          readOnly={state === "readOnly"}
        >
          <Select.Label>{t(`states.${state}`)}</Select.Label>
          <Select.Control>
            <Select.Trigger>
              <Select.ValueText />
            </Select.Trigger>
            <Select.Indicator>
              <ChevronDownIcon />
            </Select.Indicator>
          </Select.Control>
          {createPortal(
            <Select.Positioner>
              <Select.Content>
                {collection.items.map((account) => (
                  <Select.Item item={account} key={account.id}>
                    <Select.ItemText item={account}>{account.name}</Select.ItemText>
                    <Select.ItemIndicator item={account}>
                      <CheckIcon />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>,
            document.body,
          )}
        </Select.Root>
      ))}
    </Stack>
  );
}
