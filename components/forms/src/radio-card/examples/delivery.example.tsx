import { type ReactElement, useState } from "react";

import { CircleAlertIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as RadioCard from "#radio-card/index.ts";

const SPEEDS = ["standard", "next", "same"] as const;

export function Delivery(): ReactElement {
  const { t } = useWords("radio-card");
  const [speed, setSpeed] = useState<null | string>(null);
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
        <Field.Root invalid={tried && speed === null} required>
          <Field.Label>{t("speed")}</Field.Label>
          <RadioCard.Root
            onValueChange={({ value }) => {
              setSpeed(value);
            }}
            orientation="horizontal"
            value={speed}
          >
            {SPEEDS.map((choice) => (
              <RadioCard.Item key={choice} value={choice}>
                <RadioCard.ItemContent>
                  <RadioCard.ItemText>{t(`speeds.${choice}.title`)}</RadioCard.ItemText>
                  <RadioCard.ItemDescription>
                    {t(`speeds.${choice}.about`)}
                  </RadioCard.ItemDescription>
                  <RadioCard.ItemIndicator />
                </RadioCard.ItemContent>
                <RadioCard.ItemAddon>{t(`speeds.${choice}.price`)}</RadioCard.ItemAddon>
              </RadioCard.Item>
            ))}
          </RadioCard.Root>
          <Field.ErrorText>
            <CircleAlertIcon />
            {t("choose")}
          </Field.ErrorText>
        </Field.Root>
        <Button type="submit">{t("continue")}</Button>
      </Stack>
    </form>
  );
}
