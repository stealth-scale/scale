import { type ReactElement, useState } from "react";

import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as PhoneInput from "#phone-input/index.ts";

const COUNTRIES: PhoneInput.CountryCode[] = ["NL", "BE", "DE", "FR", "GB", "US"];

export function Contact(props: Partial<PhoneInput.RootProps>): ReactElement {
  const { t } = useWords("phone-input");
  const [number, setNumber] = useState({ valid: false, value: "" });

  return (
    <Field.Root>
      <Field.Label>{t("label")}</Field.Label>
      <PhoneInput.Root
        countries={COUNTRIES}
        defaultCountry="NL"
        onValueChange={({ valid, value }) => {
          setNumber({ valid, value });
        }}
        {...props}
      >
        <PhoneInput.Country
          check={<CheckIcon />}
          indicator={<ChevronDownIcon />}
          label={t("country")}
        />
        <PhoneInput.Input placeholder="06 12345678" />
      </PhoneInput.Root>
      <Field.HelperText>
        {number.valid ? t("stored", { value: number.value }) : t("draft")}
      </Field.HelperText>
    </Field.Root>
  );
}
