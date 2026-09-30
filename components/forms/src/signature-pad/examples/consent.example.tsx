import { type ReactElement, useState } from "react";

import { CircleAlertIcon, EraserIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as SignaturePad from "#signature-pad/index.ts";

export function Consent(): ReactElement {
  const { t } = useWords("signature-pad");
  const [signed, setSigned] = useState(false);
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
        <Field.Root invalid={tried && !signed} required>
          <Field.Label>{t("tenant")}</Field.Label>
          <SignaturePad.Root
            name="signature"
            onDrawEnd={(details) => {
              setSigned(details.paths.length > 0);
            }}
          >
            <SignaturePad.Control>
              <SignaturePad.Segment />
              <SignaturePad.Guide />
              <SignaturePad.ClearTrigger label={t("clear")}>
                <EraserIcon />
              </SignaturePad.ClearTrigger>
            </SignaturePad.Control>
          </SignaturePad.Root>
          <Field.HelperText>{t("lease")}</Field.HelperText>
          <Field.ErrorText>
            <CircleAlertIcon />
            {t("unsigned")}
          </Field.ErrorText>
        </Field.Root>
        <Button type="submit">{t("accept")}</Button>
      </Stack>
    </form>
  );
}
