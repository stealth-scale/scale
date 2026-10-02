import { type ReactElement, useState } from "react";

import { CheckIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Checkbox from "#checkbox/index.ts";
import * as Field from "#field/index.ts";
import * as PasswordInput from "#password-input/index.ts";

const FIELDS = [
  { autoComplete: "current-password", key: "current" },
  { autoComplete: "new-password", key: "new" },
  { autoComplete: "new-password", key: "repeat" },
] as const;

export function Change(): ReactElement {
  const { t } = useWords("password-input");
  const [shown, setShown] = useState(false);

  return (
    <Stack gap="md">
      {FIELDS.map((field) => (
        <Field.Root key={field.key}>
          <Field.Label>{t(field.key)}</Field.Label>
          <PasswordInput.Root autoComplete={field.autoComplete} visible={shown}>
            <PasswordInput.Input />
          </PasswordInput.Root>
        </Field.Root>
      ))}
      <Checkbox.Root
        checked={shown}
        onCheckedChange={({ checked }) => {
          setShown(checked === true);
        }}
      >
        <Checkbox.Control>
          <Checkbox.Indicator>
            <CheckIcon strokeWidth={3} />
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.Label>{t("show")}</Checkbox.Label>
      </Checkbox.Root>
    </Stack>
  );
}
