import { type ReactElement, useState } from "react";

import { CircleAlertIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as InputMask from "#input-mask/index.ts";

export function Iban(): ReactElement {
  const { t } = useWords("input-mask");
  const [complete, setComplete] = useState(false);
  const [tried, setTried] = useState(false);

  return (
    <form
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        setTried(true);
      }}
    >
      <Stack align="flex-start" gap="lg">
        <Field.Root invalid={tried && !complete} required>
          <Field.Label>{t("iban")}</Field.Label>
          <InputMask.Root
            mask="AA99 AAAA 9999 9999 99"
            name="iban"
            onValueChange={(details) => {
              setComplete(details.complete);
            }}
          >
            <InputMask.Input autoComplete="off" />
          </InputMask.Root>
          <Field.HelperText>{t("ibanHelp")}</Field.HelperText>
          <Field.ErrorText>
            <CircleAlertIcon />
            {t("ibanShort")}
          </Field.ErrorText>
        </Field.Root>
        <Button type="submit">{t("addPayee")}</Button>
      </Stack>
    </form>
  );
}
