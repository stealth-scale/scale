import { type ReactElement } from "react";

import { CircleAlertIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";

export function Delivery(props: Fieldset.RootProps): ReactElement {
  const { t } = useWords("fieldset");

  return (
    <Fieldset.Root {...props}>
      <Fieldset.Legend>{t("delivery")}</Fieldset.Legend>
      <Fieldset.HelperText>{t("helper")}</Fieldset.HelperText>
      <Field.Root>
        <Field.Label>{t("address")}</Field.Label>
        <Field.Control autoComplete="street-address" />
      </Field.Root>
      <Field.Root>
        <Field.Label>{t("city")}</Field.Label>
        <Field.Control autoComplete="address-level2" />
      </Field.Root>
      <Fieldset.ErrorText>
        <CircleAlertIcon />
        {t("none")}
      </Fieldset.ErrorText>
    </Fieldset.Root>
  );
}
