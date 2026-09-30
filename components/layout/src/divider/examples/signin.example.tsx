import { type ReactElement } from "react";

import { KeyRoundIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Field } from "@stealthscale/component-forms";
import { useWords } from "@stealthscale/specimen";

import { Divider } from "#divider/index.ts";
import { Stack } from "#stack/index.ts";

export function SignIn(): ReactElement {
  const { t } = useWords("divider");

  return (
    <Stack
      as="form"
      gap="md"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Button variant="outline">
        <KeyRoundIcon />
        {t("passkey")}
      </Button>
      <Divider label={t("or")} />
      <Field.Root>
        <Field.Label>{t("email")}</Field.Label>
        <Field.Control autoComplete="email" name="email" type="email" />
      </Field.Root>
      <Button type="submit">{t("continue")}</Button>
    </Stack>
  );
}
