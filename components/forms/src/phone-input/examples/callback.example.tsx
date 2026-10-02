import { type ReactElement, useState } from "react";

import { CheckIcon, ChevronDownIcon, CircleAlertIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as PhoneInput from "#phone-input/index.ts";

const COUNTRIES: PhoneInput.CountryCode[] = ["NL", "BE", "DE", "GB", "US"];

export function Callback(): ReactElement {
  const { t } = useWords("phone-input");
  const [valid, setValid] = useState(false);
  const [state, setState] = useState<"idle" | "refused" | "sent">("idle");
  const [value, setValue] = useState("");

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setState(valid ? "sent" : "refused");
      }}
    >
      <Stack align="flex-start" gap="md">
        <Field.Root invalid={state === "refused"} required>
          <Field.Label>{t("callback.label")}</Field.Label>
          <PhoneInput.Root
            countries={COUNTRIES}
            defaultCountry="BE"
            name="phone"
            onValueChange={(details) => {
              setValid(details.valid);
              setValue(details.value);
              setState("idle");
            }}
          >
            <PhoneInput.Country
              check={<CheckIcon />}
              indicator={<ChevronDownIcon />}
              label={t("country")}
            />
            <PhoneInput.Input placeholder="0470 12 34 56" />
          </PhoneInput.Root>
          <Field.HelperText>
            {state === "sent" ? t("callback.sent", { value }) : t("callback.helper")}
          </Field.HelperText>
          <Field.ErrorText>
            <CircleAlertIcon />
            {t("callback.error")}
          </Field.ErrorText>
        </Field.Root>
        <Button type="submit">{t("callback.submit")}</Button>
      </Stack>
    </form>
  );
}
