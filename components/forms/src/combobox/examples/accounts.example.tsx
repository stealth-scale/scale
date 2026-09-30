import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";

import { useListCollection } from "@stealthscale/component-collections";
import { useWords } from "@stealthscale/specimen";

import * as Combobox from "#combobox/index.ts";

interface Account {
  readonly frozen: boolean;
  readonly id: string;
  readonly name: string;
}

const ACCOUNTS = ["bridge", "halden", "ilan", "marek", "perrin", "voss"] as const;

export function Accounts(props: Omit<Combobox.RootProps, "collection">): ReactElement {
  const { t } = useWords("combobox");
  const { collection, narrow } = useListCollection<Account>({
    isItemDisabled: (account) => account.frozen,
    itemToString: (account) => account.name,
    itemToValue: (account) => account.id,
    rows: ACCOUNTS.map((id) => ({ frozen: id === "voss", id, name: t(`accounts.${id}`) })),
  });

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={({ inputValue, reason }) => {
        narrow(reason === "input-change" ? inputValue : "");
      }}
      {...props}
    >
      <Combobox.Label>{t("accounts.label")}</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder={t("accounts.placeholder")} />
        <Combobox.ClearTrigger label={t("accounts.clear")}>
          <XIcon />
        </Combobox.ClearTrigger>
        <Combobox.Trigger label={t("accounts.toggle")}>
          <ChevronDownIcon />
        </Combobox.Trigger>
      </Combobox.Control>
      {createPortal(
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>{t("accounts.empty")}</Combobox.Empty>
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
  );
}
