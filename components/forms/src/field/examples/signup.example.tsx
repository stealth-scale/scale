import { type ReactElement } from "react";

import { CircleAlertIcon, CircleCheckIcon, InfoIcon, TriangleAlertIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";

export function Signup(): ReactElement {
  const { t } = useWords("field");

  return (
    <Stack gap="lg">
      <Field.Root status="success">
        <Field.Label>{t("username")}</Field.Label>
        <Field.Control autoComplete="username" defaultValue="ada" />
        <Field.ErrorText>
          <CircleCheckIcon />
          {t("reported.success")}
        </Field.ErrorText>
      </Field.Root>
      <Field.Root status="info">
        <Field.Label>{t("email")}</Field.Label>
        <Field.Control autoComplete="email" defaultValue="ada@example.com" type="email" />
        <Field.ErrorText>
          <InfoIcon />
          {t("reported.info")}
        </Field.ErrorText>
      </Field.Root>
      <Field.Root status="warning">
        <Field.Label>{t("backup")}</Field.Label>
        <Field.Control defaultValue="ada@old-host.example" type="email" />
        <Field.ErrorText>
          <TriangleAlertIcon />
          {t("reported.warning")}
        </Field.ErrorText>
      </Field.Root>
      <Field.Root invalid status="error">
        <Field.Label>{t("phone")}</Field.Label>
        <Field.Control autoComplete="tel" defaultValue="612345678" type="tel" />
        <Field.ErrorText>
          <CircleAlertIcon />
          {t("reported.error")}
        </Field.ErrorText>
      </Field.Root>
    </Stack>
  );
}
