import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { useListCollection } from "@stealthscale/component-collections";
import { useWords } from "@stealthscale/specimen";

import * as Combobox from "#combobox/index.ts";

const ORDER = ["settlements", "freight"] as const;

const DESKS = {
  freight: ["halden", "marek", "perrin"],
  settlements: ["bridge", "ilan"],
} as const;

interface Account {
  readonly desk: (typeof ORDER)[number];
  readonly id: string;
  readonly name: string;
}

export function Desks(): ReactElement {
  const { t } = useWords("combobox");
  const { collection, narrow } = useListCollection<Account>({
    itemToString: (account) => account.name,
    itemToValue: (account) => account.id,
    rows: ORDER.flatMap((desk) =>
      DESKS[desk].map((id) => ({ desk, id, name: t(`accounts.${id}`) })),
    ),
  });

  return (
    <Combobox.Root
      collection={collection}
      onInputValueChange={({ inputValue, reason }) => {
        narrow(reason === "input-change" ? inputValue : "");
      }}
    >
      <Combobox.Label>{t("accounts.label")}</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder={t("accounts.placeholder")} />
        <Combobox.Trigger label={t("accounts.toggle")}>
          <ChevronDownIcon />
        </Combobox.Trigger>
      </Combobox.Control>
      {createPortal(
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>{t("accounts.empty")}</Combobox.Empty>
            {ORDER.filter((desk) => collection.items.some((account) => account.desk === desk)).map(
              (desk) => (
                <Combobox.ItemGroup id={desk} key={desk}>
                  <Combobox.ItemGroupLabel htmlFor={desk}>
                    {t(`desks.${desk}`)}
                  </Combobox.ItemGroupLabel>
                  {collection.items
                    .filter((account) => account.desk === desk)
                    .map((account) => (
                      <Combobox.Item item={account} key={account.id}>
                        <Combobox.ItemText item={account}>{account.name}</Combobox.ItemText>
                        <Combobox.ItemIndicator item={account}>
                          <CheckIcon />
                        </Combobox.ItemIndicator>
                      </Combobox.Item>
                    ))}
                </Combobox.ItemGroup>
              ),
            )}
          </Combobox.Content>
        </Combobox.Positioner>,
        document.body,
      )}
    </Combobox.Root>
  );
}
