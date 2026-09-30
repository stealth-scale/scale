import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { useListCollection } from "@stealthscale/component-collections";
import { useWords } from "@stealthscale/specimen";

import * as Select from "#select/index.ts";

interface Account {
  readonly frozen: boolean;
  readonly id: string;
  readonly name: string;
}

const ACCOUNTS = ["bridge", "halden", "perrin", "voss"] as const;

export function Accounts(props: Omit<Select.RootProps, "collection">): ReactElement {
  const { t } = useWords("select");
  const { collection } = useListCollection<Account>({
    isItemDisabled: (account) => account.frozen,
    itemToString: (account) => account.name,
    itemToValue: (account) => account.id,
    rows: ACCOUNTS.map((id) => ({ frozen: id === "voss", id, name: t(`accounts.${id}`) })),
  });

  return (
    <Select.Root collection={collection} {...props}>
      <Select.Label>{t("accounts.label")}</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={t("accounts.placeholder")} />
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
  );
}
