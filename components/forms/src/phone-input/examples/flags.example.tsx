import { type ReactElement } from "react";

import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as PhoneInput from "#phone-input/index.ts";

const COUNTRIES: PhoneInput.CountryCode[] = ["NL", "BE", "DE", "FR", "GB", "US", "CA", "JP"];

const OFFSET = 0x1_f1_e6 - 65;

function flagOf(country: PhoneInput.CountryCode): string {
  return String.fromCodePoint(
    ...Array.from(country, (letter) => OFFSET + (letter.codePointAt(0) ?? 65)),
  );
}

export function Flags(): ReactElement {
  const { t } = useWords("phone-input");

  return (
    <Field.Root>
      <Field.Label>{t("label")}</Field.Label>
      <PhoneInput.Root countries={COUNTRIES} defaultCountry="DE">
        <PhoneInput.Country
          check={<CheckIcon />}
          flagOf={flagOf}
          indicator={<ChevronDownIcon />}
          label={t("country")}
        />
        <PhoneInput.Input placeholder="0151 23456789" />
      </PhoneInput.Root>
      <Field.HelperText>{t("flags.helper")}</Field.HelperText>
    </Field.Root>
  );
}
