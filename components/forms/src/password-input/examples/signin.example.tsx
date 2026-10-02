import { type ReactElement } from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as PasswordInput from "#password-input/index.ts";

export function SignIn(props: PasswordInput.RootProps): ReactElement {
  const { t } = useWords("password-input");

  return (
    <Field.Root>
      <Field.Label>{t("password")}</Field.Label>
      <PasswordInput.Root autoComplete="current-password" name="password" {...props}>
        <PasswordInput.Input />
        <PasswordInput.VisibilityTrigger>
          <PasswordInput.Indicator fallback={<EyeIcon />}>
            <EyeOffIcon />
          </PasswordInput.Indicator>
        </PasswordInput.VisibilityTrigger>
      </PasswordInput.Root>
    </Field.Root>
  );
}
