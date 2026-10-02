import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";

export function Notes(): ReactElement {
  const { t } = useWords("field");

  return (
    <Field.Root maxLength={200}>
      <Field.Label>{t("notes")}</Field.Label>
      <Field.Textarea defaultValue={t("note")} grows maxRows={6} rows={2} />
      <Field.HelperText>{t("courier")}</Field.HelperText>
      <Field.Counter />
    </Field.Root>
  );
}
