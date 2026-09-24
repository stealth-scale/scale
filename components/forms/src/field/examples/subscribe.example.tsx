import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";

export function Subscribe(props: Field.RootProps): ReactElement {
  const { t } = useWords("field");

  return (
    <Field.Root maxLength={80} {...props}>
      <Field.Label>{t("email")}</Field.Label>
      <Field.Control autoComplete="email" placeholder=" " type="email" />
      <Field.HelperText>{t("monthly")}</Field.HelperText>
      <Field.Counter />
    </Field.Root>
  );
}
