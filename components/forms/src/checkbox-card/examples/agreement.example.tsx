import { type ReactElement, useState } from "react";

import { CheckIcon, CircleAlertIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as CheckboxCard from "#checkbox-card/index.ts";
import * as Field from "#field/index.ts";

export function Agreement(): ReactElement {
  const { t } = useWords("checkbox-card");
  const [accepted, setAccepted] = useState(false);
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
        <Field.Root invalid={tried && !accepted} required>
          <CheckboxCard.Root
            name="agreement"
            onCheckedChange={({ checked }) => {
              setAccepted(checked === true);
            }}
          >
            <CheckboxCard.Content>
              <CheckboxCard.Label>{t("dpa.title")}</CheckboxCard.Label>
              <CheckboxCard.Description>{t("dpa.about")}</CheckboxCard.Description>
              <CheckboxCard.Control>
                <CheckboxCard.Indicator>
                  <CheckIcon strokeWidth={3} />
                </CheckboxCard.Indicator>
              </CheckboxCard.Control>
            </CheckboxCard.Content>
          </CheckboxCard.Root>
          <Field.ErrorText>
            <CircleAlertIcon />
            {t("dpa.required")}
          </Field.ErrorText>
        </Field.Root>
        <Button type="submit">{t("continue")}</Button>
      </Stack>
    </form>
  );
}
