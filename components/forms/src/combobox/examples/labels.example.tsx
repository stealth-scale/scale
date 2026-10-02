import { type ReactElement, useState } from "react";
import { createPortal } from "react-dom";

import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { useListCollection } from "@stealthscale/component-collections";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Combobox from "#combobox/index.ts";

interface Label {
  readonly id: string;
  readonly name: string;
}

const LABELS = ["bug", "design", "docs", "infra", "research"] as const;

export function Labels(): ReactElement {
  const { t } = useWords("combobox");
  const [saved, setSaved] = useState("");
  const { collection, narrow } = useListCollection<Label>({
    itemToString: (label) => label.name,
    itemToValue: (label) => label.id,
    rows: LABELS.map((id) => ({ id, name: t(`labels.${id}`) })),
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        const label = new FormData(event.currentTarget).get("label");

        setSaved(typeof label === "string" ? label : "");
      }}
    >
      <Stack align="flex-start" gap="md">
        <Combobox.Root
          allowCustomValue
          collection={collection}
          name="label"
          onInputValueChange={({ inputValue, reason }) => {
            narrow(reason === "input-change" ? inputValue : "");
          }}
        >
          <Combobox.Label>{t("labels.label")}</Combobox.Label>
          <Combobox.Control>
            <Combobox.Input placeholder={t("labels.placeholder")} />
            <Combobox.Trigger label={t("labels.toggle")}>
              <ChevronDownIcon />
            </Combobox.Trigger>
          </Combobox.Control>
          {createPortal(
            <Combobox.Positioner>
              <Combobox.Content>
                <Combobox.Empty>{t("labels.empty")}</Combobox.Empty>
                {collection.items.map((label) => (
                  <Combobox.Item item={label} key={label.id}>
                    <Combobox.ItemText item={label}>{label.name}</Combobox.ItemText>
                    <Combobox.ItemIndicator item={label}>
                      <CheckIcon />
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                ))}
              </Combobox.Content>
            </Combobox.Positioner>,
            document.body,
          )}
        </Combobox.Root>
        <Button type="submit">{t("labels.submit")}</Button>
        <Text as="output">
          {saved === "" ? t("labels.none") : t("labels.saved", { label: saved })}
        </Text>
      </Stack>
    </form>
  );
}
