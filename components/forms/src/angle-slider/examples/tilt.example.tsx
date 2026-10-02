import { type ReactElement, useState } from "react";

import { CircleAlertIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as AngleSlider from "#angle-slider/index.ts";
import * as Field from "#field/index.ts";

const LOWEST = 15;

const HIGHEST = 60;

export function Tilt(): ReactElement {
  const { t } = useWords("angle-slider");
  const [tilt, setTilt] = useState(70);
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
        <Field.Root invalid={tried && (tilt < LOWEST || tilt > HIGHEST)}>
          <Field.Label>{t("panel.label")}</Field.Label>
          <AngleSlider.Root
            locale="en-GB"
            name="tilt"
            onValueChange={({ value }) => {
              setTilt(value);
            }}
            step={5}
            value={tilt}
          >
            <AngleSlider.Control>
              <AngleSlider.Track>
                <AngleSlider.Range />
              </AngleSlider.Track>
              <AngleSlider.Thumb />
              <AngleSlider.ValueText />
            </AngleSlider.Control>
          </AngleSlider.Root>
          <Field.HelperText>
            {t("panel.helper", { highest: HIGHEST, lowest: LOWEST })}
          </Field.HelperText>
          <Field.ErrorText>
            <CircleAlertIcon />
            {t("panel.error", { highest: HIGHEST, lowest: LOWEST })}
          </Field.ErrorText>
        </Field.Root>
        <Button type="submit">{t("save")}</Button>
      </Stack>
    </form>
  );
}
