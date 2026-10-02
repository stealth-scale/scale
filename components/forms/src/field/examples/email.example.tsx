import { type ReactElement } from "react";

import { CircleAlertIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";

export function Email(props: Field.RootProps): ReactElement {
  const { t } = useWords("field");

  return (
    <Field.Root maxLength={80} {...props}>
      <Field.Label>
        {t("email")}
        <Field.RequiredIndicator />
      </Field.Label>
      <Field.Control autoComplete="email" defaultValue="ada@example.com" type="email" />
      <Field.HelperText>{t("helper")}</Field.HelperText>
      <Field.Counter />
      <Field.ErrorText>
        <CircleAlertIcon />
        {t("unknown")}
      </Field.ErrorText>
    </Field.Root>
  );
}
