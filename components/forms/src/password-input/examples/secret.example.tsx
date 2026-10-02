import { type ReactElement } from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as PasswordInput from "#password-input/index.ts";

export function Secret(): ReactElement {
  const { t } = useWords("password-input");

  return (
    <Field.Root readOnly>
      <Field.Label>{t("secret")}</Field.Label>
      <PasswordInput.Root ignorePasswordManagers>
        <PasswordInput.Input defaultValue="demo-4f9c2e81b7d3a605" />
        <PasswordInput.VisibilityTrigger label={t("reveal")} visibleLabel={t("conceal")}>
          <PasswordInput.Indicator fallback={<EyeIcon />}>
            <EyeOffIcon />
          </PasswordInput.Indicator>
        </PasswordInput.VisibilityTrigger>
      </PasswordInput.Root>
      <Field.HelperText>{t("signing")}</Field.HelperText>
    </Field.Root>
  );
}
