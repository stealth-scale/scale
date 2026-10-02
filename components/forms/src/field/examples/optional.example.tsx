import { type ReactElement } from "react";

import { Badge } from "@stealthscale/component-data";
import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";

export function Optional(): ReactElement {
  const { t } = useWords("field");

  return (
    <Field.Root>
      <Field.Label>
        {t("company")}
        <Field.OptionalIndicator>
          <Badge size="sm">{t("badge")}</Badge>
        </Field.OptionalIndicator>
      </Field.Label>
      <Field.Control autoComplete="organization" />
      <Field.HelperText>{t("invoiced")}</Field.HelperText>
    </Field.Root>
  );
}
