import { type ReactElement } from "react";

import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";

export function Checkout(): ReactElement {
  const { t } = useWords("fieldset");

  return (
    <Stack gap="xl">
      <Fieldset.Root status="info">
        <Fieldset.Legend>{t("window")}</Fieldset.Legend>
        <Field.Root>
          <Field.Label>{t("day")}</Field.Label>
          <Field.Control defaultValue={t("friday")} />
        </Field.Root>
        <Fieldset.ErrorText>
          <InfoIcon />
          {t("reported.info")}
        </Fieldset.ErrorText>
      </Fieldset.Root>
      <Fieldset.Root status="success">
        <Fieldset.Legend>{t("address")}</Fieldset.Legend>
        <Field.Root>
          <Field.Label>{t("postcode")}</Field.Label>
          <Field.Control autoComplete="postal-code" defaultValue="1017 AB" />
        </Field.Root>
        <Fieldset.ErrorText>
          <CircleCheckIcon />
          {t("reported.success")}
        </Fieldset.ErrorText>
      </Fieldset.Root>
      <Fieldset.Root status="warning">
        <Fieldset.Legend>{t("contact")}</Fieldset.Legend>
        <Field.Root>
          <Field.Label>{t("phone")}</Field.Label>
          <Field.Control autoComplete="tel" defaultValue="+31 6 1234 5678" type="tel" />
        </Field.Root>
        <Fieldset.ErrorText>
          <TriangleAlertIcon />
          {t("reported.warning")}
        </Fieldset.ErrorText>
      </Fieldset.Root>
      <Fieldset.Root invalid status="error">
        <Fieldset.Legend>{t("payment")}</Fieldset.Legend>
        <Field.Root>
          <Field.Label>{t("card")}</Field.Label>
          <Field.Control autoComplete="cc-number" inputMode="numeric" />
        </Field.Root>
        <Fieldset.ErrorText>
          <CircleAlertIcon />
          {t("reported.error")}
        </Fieldset.ErrorText>
      </Fieldset.Root>
    </Stack>
  );
}
