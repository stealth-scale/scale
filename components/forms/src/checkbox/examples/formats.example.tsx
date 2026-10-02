import { type ReactElement, useState } from "react";

import { CheckIcon, CircleAlertIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Checkbox from "#checkbox/index.ts";
import * as Fieldset from "#fieldset/index.ts";

const FORMATS = ["csv", "xlsx", "pdf"];

export function Formats(): ReactElement {
  const { t } = useWords("checkbox");
  const [formats, setFormats] = useState<string[]>([]);
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
        <Fieldset.Root invalid={tried && formats.length === 0}>
          <Fieldset.Legend>{t("formats.legend")}</Fieldset.Legend>
          <Fieldset.HelperText>{t("formats.helper")}</Fieldset.HelperText>
          <Checkbox.Group name="formats" onValueChange={setFormats} value={formats}>
            {FORMATS.map((format) => (
              <Checkbox.Root key={format} value={format}>
                <Checkbox.Control>
                  <Checkbox.Indicator>
                    <CheckIcon strokeWidth={3} />
                  </Checkbox.Indicator>
                </Checkbox.Control>
                <Checkbox.Label>{t(`formats.names.${format}`)}</Checkbox.Label>
              </Checkbox.Root>
            ))}
          </Checkbox.Group>
          <Fieldset.ErrorText>
            <CircleAlertIcon />
            {t("formats.required")}
          </Fieldset.ErrorText>
        </Fieldset.Root>
        <Button type="submit">{t("formats.submit")}</Button>
      </Stack>
    </form>
  );
}
