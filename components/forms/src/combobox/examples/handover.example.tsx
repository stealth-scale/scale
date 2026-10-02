import { type ReactElement, useState } from "react";
import { createPortal } from "react-dom";

import { CheckIcon, ChevronDownIcon, CircleAlertIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { useListCollection } from "@stealthscale/component-collections";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Combobox from "#combobox/index.ts";
import * as Field from "#field/index.ts";

interface Person {
  readonly id: string;
  readonly name: string;
}

const PEOPLE = ["ada", "grace", "hana", "ines", "jonas", "mateo", "priya"] as const;

export function Handover(): ReactElement {
  const { t } = useWords("combobox");
  const [owner, setOwner] = useState<string[]>([]);
  const [sent, setSent] = useState("");
  const [tried, setTried] = useState(false);
  const { collection, narrow } = useListCollection<Person>({
    itemToString: (person) => person.name,
    itemToValue: (person) => person.id,
    rows: PEOPLE.map((id) => ({ id, name: t(`people.${id}`) })),
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setTried(true);

        const submitted = new FormData(event.currentTarget).get("owner");

        setSent(typeof submitted === "string" ? submitted : "");
      }}
    >
      <Stack align="flex-start" gap="lg">
        <Field.Root invalid={tried && owner.length === 0} required>
          <Field.Label>
            {t("owner.label")}
            <Field.RequiredIndicator />
          </Field.Label>
          <Combobox.Root
            collection={collection}
            name="owner"
            onInputValueChange={({ inputValue, reason }) => {
              narrow(reason === "input-change" ? inputValue : "");
            }}
            onValueChange={({ value }) => {
              setOwner(value);
            }}
            value={owner}
          >
            <Combobox.Control>
              <Combobox.Input placeholder={t("people.placeholder")} />
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
          <Field.HelperText>{t("owner.help")}</Field.HelperText>
          <Field.ErrorText>
            <CircleAlertIcon />
            {t("owner.required")}
          </Field.ErrorText>
        </Field.Root>
        <Button type="submit">{t("owner.submit")}</Button>
        <Text as="output">{sent === "" ? null : t("owner.sent", { id: sent })}</Text>
      </Stack>
    </form>
  );
}
