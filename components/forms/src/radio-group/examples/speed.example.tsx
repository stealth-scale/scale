import { type ReactElement, useState } from "react";

import { CircleAlertIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Fieldset from "#fieldset/index.ts";
import * as RadioGroup from "#radio-group/index.ts";

const SPEEDS = ["same", "next", "standard"] as const;

export function Speed(): ReactElement {
  const { t } = useWords("radio-group");
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
        <Fieldset.Root invalid={tried && speed === null}>
          <Fieldset.Legend>{t("speed")}</Fieldset.Legend>
          <Fieldset.HelperText>{t("cutoff")}</Fieldset.HelperText>
          <RadioGroup.Root
            name="speed"
            onValueChange={(details) => {
              setSpeed(details.value);
            }}
            required
            value={speed}
          >
            {SPEEDS.map((option) => (
              <RadioGroup.Item disabled={option === "same"} key={option} value={option}>
                <RadioGroup.ItemControl />
                <RadioGroup.ItemText>{t(`speeds.${option}`)}</RadioGroup.ItemText>
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
          <Fieldset.ErrorText>
            <CircleAlertIcon />
            {t("choose")}
          </Fieldset.ErrorText>
        </Fieldset.Root>
        <Button type="submit">{t("continue")}</Button>
      </Stack>
    </form>
  );
}
