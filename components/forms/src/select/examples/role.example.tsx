import { type ReactElement, useState } from "react";
import { createPortal } from "react-dom";

import { CheckIcon, ChevronDownIcon, CircleAlertIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { useListCollection } from "@stealthscale/component-collections";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as Select from "#select/index.ts";

interface Role {
  readonly id: string;
  readonly name: string;
}

const ROLES = ["viewer", "editor", "admin"] as const;

export function Invitation(): ReactElement {
  const { t } = useWords("select");
  const [role, setRole] = useState<string[]>([]);
  const [tried, setTried] = useState(false);
  const { collection } = useListCollection<Role>({
    itemToString: (each) => each.name,
    itemToValue: (each) => each.id,
    rows: ROLES.map((id) => ({ id, name: t(`role.${id}`) })),
  });

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setTried(true);
      }}
    >
      <Stack align="flex-start" gap="lg">
        <Field.Root invalid={tried && role.length === 0} required>
          <Field.Label>
            {t("role.label")}
            <Field.RequiredIndicator />
          </Field.Label>
          <Select.Root
            collection={collection}
            name="role"
            onValueChange={({ value }) => {
              setRole(value);
            }}
            value={role}
          >
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText placeholder={t("role.placeholder")} />
              </Select.Trigger>
              <Select.Indicator>
                <ChevronDownIcon />
              </Select.Indicator>
            </Select.Control>
            {createPortal(
              <Select.Positioner>
                <Select.Content>
                  {collection.items.map((each) => (
                    <Select.Item item={each} key={each.id}>
                      <Select.ItemText item={each}>{each.name}</Select.ItemText>
                      <Select.ItemIndicator item={each}>
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>,
              document.body,
            )}
          </Select.Root>
          <Field.HelperText>{t("role.help")}</Field.HelperText>
          <Field.ErrorText>
            <CircleAlertIcon />
            {t("role.required")}
          </Field.ErrorText>
        </Field.Root>
        <Button type="submit">{t("role.submit")}</Button>
      </Stack>
    </form>
  );
}
