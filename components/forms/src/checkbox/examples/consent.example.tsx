import { type ReactElement, useState } from "react";

import { CheckIcon, CircleAlertIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Checkbox from "#checkbox/index.ts";
import * as Field from "#field/index.ts";

export function Consent(): ReactElement {
  const { t } = useWords("checkbox");
  const [accepted, setAccepted] = useState(false);

  return (
    <Field.Root invalid={!accepted} required>
      <Checkbox.Root
        name="terms"
        onCheckedChange={({ checked }) => {
          setAccepted(checked === true);
        }}
      >
        <Checkbox.Control>
          <Checkbox.Indicator>
            <CheckIcon strokeWidth={3} />
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.Label>{t("terms")}</Checkbox.Label>
      </Checkbox.Root>
      <Field.HelperText>{t("read")}</Field.HelperText>
      <Field.ErrorText>
        <CircleAlertIcon />
        {t("accept")}
      </Field.ErrorText>
    </Field.Root>
  );
}
