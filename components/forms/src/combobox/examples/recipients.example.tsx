import { type ReactElement, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";

import { useListCollection } from "@stealthscale/component-collections";
import { Tag } from "@stealthscale/component-data";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Combobox from "#combobox/index.ts";

interface Person {
  readonly id: string;
  readonly name: string;
}

const PEOPLE = ["ada", "grace", "hana", "ines", "jonas", "mateo", "priya"] as const;

export function Recipients(): ReactElement {
  const { t } = useWords("combobox");
  const [value, setValue] = useState<string[]>(["ada", "hana"]);
  const input = useRef<HTMLInputElement>(null);
  const { collection, narrow } = useListCollection<Person>({
    itemToString: (person) => person.name,
    itemToValue: (person) => person.id,
    rows: PEOPLE.map((id) => ({ id, name: t(`people.${id}`) })),
  });

  return (
    <Stack gap="sm">
      <Combobox.Root
        collection={collection}
        multiple
        onInputValueChange={({ inputValue, reason }) => {
          narrow(reason === "input-change" ? inputValue : "");
        }}
        onValueChange={(details) => {
          setValue(details.value);
        }}
        value={value}
      >
        <Combobox.Label>{t("recipients.label")}</Combobox.Label>
        <Combobox.Control>
          <Combobox.Input placeholder={t("recipients.placeholder")} ref={input} />
          <Combobox.Trigger label={t("people.toggle")}>
            <ChevronDownIcon />
          </Combobox.Trigger>
        </Combobox.Control>
        {createPortal(
          <Combobox.Positioner>
            <Combobox.Content>
              <Combobox.Empty>{t("people.empty")}</Combobox.Empty>
              {collection.items.map((person) => (
                <Combobox.Item item={person} key={person.id}>
                  <Combobox.ItemText item={person}>{person.name}</Combobox.ItemText>
                  <Combobox.ItemIndicator item={person}>
                    <CheckIcon />
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              ))}
            </Combobox.Content>
          </Combobox.Positioner>,
          document.body,
        )}
      </Combobox.Root>
      <Stack direction="row" gap="xs" wrap>
        {value.map((id) => (
          <Tag.Root key={id}>
            <Tag.Label>{t(`people.${id}`)}</Tag.Label>
            <Tag.CloseTrigger
              aria-label={t("recipients.remove", { name: t(`people.${id}`) })}
              onClick={() => {
                setValue((left) => left.filter((one) => one !== id));
                input.current?.focus();
              }}
            >
              <XIcon aria-hidden />
            </Tag.CloseTrigger>
          </Tag.Root>
        ))}
      </Stack>
    </Stack>
  );
}
