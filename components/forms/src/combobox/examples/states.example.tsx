import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { useListCollection } from "@stealthscale/component-collections";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Combobox from "#combobox/index.ts";

interface Account {
  readonly id: string;
  readonly name: string;
}

const STATES = ["disabled", "readOnly", "invalid"] as const;

export function States(): ReactElement {
  const { t } = useWords("combobox");
  const { collection } = useListCollection<Account>({
    itemToString: (account) => account.name,
    itemToValue: (account) => account.id,
    rows: [{ id: "bridge", name: t("accounts.bridge") }],
  });

  return (
    <Stack gap="md">
      {STATES.map((state) => (
        <Combobox.Root
          collection={collection}
          defaultValue={["bridge"]}
          disabled={state === "disabled"}
          invalid={state === "invalid"}
          key={state}
          readOnly={state === "readOnly"}
        >
          <Combobox.Label>{t(`states.${state}`)}</Combobox.Label>
          <Combobox.Control>
            <Combobox.Input />
            <Combobox.Trigger label={t("accounts.toggle")}>
              <ChevronDownIcon />
            </Combobox.Trigger>
          </Combobox.Control>
          {createPortal(
            <Combobox.Positioner>
              <Combobox.Content>
                {collection.items.map((account) => (
                  <Combobox.Item item={account} key={account.id}>
                    <Combobox.ItemText item={account}>{account.name}</Combobox.ItemText>
                    <Combobox.ItemIndicator item={account}>
                      <CheckIcon />
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                ))}
              </Combobox.Content>
            </Combobox.Positioner>,
            document.body,
          )}
        </Combobox.Root>
      ))}
    </Stack>
  );
}
