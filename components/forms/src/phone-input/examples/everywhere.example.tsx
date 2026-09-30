import { type ReactElement } from "react";

import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as PhoneInput from "#phone-input/index.ts";

export function Everywhere(): ReactElement {
  const { t } = useWords("phone-input");

  return (
    <Field.Root>
      <Field.Label>{t("label")}</Field.Label>
      <PhoneInput.Root defaultCountry="GB">
        <PhoneInput.Country
          check={<CheckIcon />}
          indicator={<ChevronDownIcon />}
          label={t("country")}
        />
        <PhoneInput.Input placeholder="07400 123456" />
      </PhoneInput.Root>
      <Field.HelperText>{t("everywhere.helper")}</Field.HelperText>
    </Field.Root>
  );
}
