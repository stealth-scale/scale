import { type ReactElement, useState } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as PinInput from "#pin-input/index.ts";

const PLACES = [0, 1, 2, 3, 4, 5];

const EXPECTED = "246810";

export function Confirm(): ReactElement {
  const { t } = useWords("pin-input");
  const [wrong, setWrong] = useState(false);

  return (
    <Field.Root invalid={wrong}>
      <Field.Label>{t("authenticator")}</Field.Label>
      <PinInput.Root
        count={6}
        onValueChange={() => {
          setWrong(false);
        }}
        onValueComplete={({ valueAsString }) => {
          setWrong(valueAsString !== EXPECTED);
        }}
        otp
      >
        <PinInput.Control>
          {PLACES.map((index) => (
            <PinInput.Input index={index} key={index} label={t("digit6", { place: index + 1 })} />
          ))}
        </PinInput.Control>
      </PinInput.Root>
      <Field.HelperText>{t("app")}</Field.HelperText>
      <Field.ErrorText>{t("wrong")}</Field.ErrorText>
    </Field.Root>
  );
}
