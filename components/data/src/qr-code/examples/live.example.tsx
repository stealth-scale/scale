import { type ReactElement, useState } from "react";

import { Field } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as QrCode from "#qr-code/index.ts";

export function Live(): ReactElement {
  const { t } = useWords("qr-code");
  const [link, setLink] = useState("https://stealthscale.io/docs");

  return (
    <Stack align="flex-start" gap="md">
      <Field.Root>
        <Field.Label>{t("live.field")}</Field.Label>
        <Field.Control
          onChange={({ currentTarget }) => {
            setLink(currentTarget.value);
          }}
          type="url"
          value={link}
        />
      </Field.Root>
      {link === "" ? null : (
        <QrCode.Root value={link}>
          <QrCode.Frame label={t("live.label", { link })}>
            <QrCode.Pattern />
          </QrCode.Frame>
        </QrCode.Root>
      )}
    </Stack>
  );
}
