import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as InputMask from "#input-mask/index.ts";

export function Zip(): ReactElement {
  const { t } = useWords("input-mask");

  return (
    <Field.Root>
      <Field.Label>{t("zip")}</Field.Label>
      <InputMask.Root defaultValue="941031234" mask={["99999", "99999-9999"]}>
        <InputMask.Input autoComplete="postal-code" />
      </InputMask.Root>
      <Field.HelperText>{t("zipHelp")}</Field.HelperText>
    </Field.Root>
  );
}
