import { type ReactElement, type ReactNode, useState } from "react";
import { createPortal } from "react-dom";

import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { useListCollection } from "@stealthscale/component-collections";
import { Strong } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Combobox from "#combobox/index.ts";

interface Country {
  readonly id: string;
  readonly name: string;
}

const COUNTRIES = [
  "argentina",
  "australia",
  "austria",
  "belgium",
  "brazil",
  "canada",
  "denmark",
  "finland",
  "france",
  "germany",
  "ireland",
  "japan",
  "netherlands",
  "norway",
  "portugal",
  "spain",
  "sweden",
] as const;

function marked(name: string, typed: string): ReactNode {
  const start = name.toLowerCase().indexOf(typed.toLowerCase());

  if (typed === "" || start === -1) return name;

  const end = start + typed.length;

  return (
    <>
      {name.slice(0, start)}
      <Strong>{name.slice(start, end)}</Strong>
      {name.slice(end)}
    </>
  );
}

export function Countries(): ReactElement {
  const { t } = useWords("combobox");
  const [typed, setTyped] = useState("");
  const { collection, narrow } = useListCollection<Country>({
    itemToString: (country) => country.name,
    itemToValue: (country) => country.id,
    rows: COUNTRIES.map((id) => ({ id, name: t(`countries.${id}`) })),
  });

  return (
    <Combobox.Root
      collection={collection}
      inputBehavior="autohighlight"
      onInputValueChange={({ inputValue, reason }) => {
        const query = reason === "input-change" ? inputValue : "";

        setTyped(query);
        narrow(query);
      }}
      openOnClick
    >
      <Combobox.Label>{t("countries.label")}</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input placeholder={t("countries.placeholder")} />
        <Combobox.Trigger label={t("countries.toggle")}>
          <ChevronDownIcon />
        </Combobox.Trigger>
      </Combobox.Control>
      {createPortal(
        <Combobox.Positioner>
          <Combobox.Content>
            <Combobox.Empty>{t("countries.empty")}</Combobox.Empty>
            {collection.items.map((country) => (
              <Combobox.Item item={country} key={country.id}>
                <Combobox.ItemText item={country}>{marked(country.name, typed)}</Combobox.ItemText>
                <Combobox.ItemIndicator item={country}>
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
