import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as PinInput from "#pin-input/index.ts";

const PLACES = [0, 1, 2, 3, 4, 5];

export function Verify(): ReactElement {
  const { t } = useWords("pin-input");

  return (
    <Field.Root>
      <Field.Label>{t("verification")}</Field.Label>
      <PinInput.Root count={6} otp>
        <PinInput.Control>
          {PLACES.map((index) => (
            <PinInput.Input index={index} key={index} label={t("digit6", { place: index + 1 })} />
          ))}
        </PinInput.Control>
      </PinInput.Root>
      <Field.HelperText>{t("sent")}</Field.HelperText>
    </Field.Root>
  );
}
