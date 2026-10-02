import { type ReactElement } from "react";

import { PhoneIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as InputGroup from "#input-group/index.ts";
import * as PhoneInput from "#phone-input/index.ts";

export function National(): ReactElement {
  const { t } = useWords("phone-input");

  return (
    <Field.Root>
      <Field.Label>{t("national.label")}</Field.Label>
      <PhoneInput.Root defaultCountry="US">
        <InputGroup.Mark aria-hidden>
          <PhoneIcon />
        </InputGroup.Mark>
        <PhoneInput.Input placeholder="(212) 555-0123" />
      </PhoneInput.Root>
      <Field.HelperText>{t("national.helper")}</Field.HelperText>
    </Field.Root>
  );
}
