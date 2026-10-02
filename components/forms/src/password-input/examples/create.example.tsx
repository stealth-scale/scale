import { type ReactElement, useState } from "react";

import { CircleAlertIcon, EyeIcon, EyeOffIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as PasswordInput from "#password-input/index.ts";

const LEAST = 12;

export function Create(): ReactElement {
  const { t } = useWords("password-input");
  const [length, setLength] = useState(0);
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
        <Field.Root invalid={tried && length < LEAST} required>
          <Field.Label>{t("new")}</Field.Label>
          <PasswordInput.Root autoComplete="new-password" name="new-password">
            <PasswordInput.Input
              onChange={(event) => {
                setLength(event.target.value.length);
              }}
            />
            <PasswordInput.VisibilityTrigger>
              <PasswordInput.Indicator fallback={<EyeIcon />}>
                <EyeOffIcon />
              </PasswordInput.Indicator>
            </PasswordInput.VisibilityTrigger>
          </PasswordInput.Root>
          <Field.HelperText>{t("rule", { count: LEAST })}</Field.HelperText>
          <Field.ErrorText>
            <CircleAlertIcon />
            {t("short", { count: LEAST })}
          </Field.ErrorText>
        </Field.Root>
        <Button type="submit">{t("create")}</Button>
      </Stack>
    </form>
  );
}
