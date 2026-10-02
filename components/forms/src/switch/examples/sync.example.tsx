import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as Switch from "#switch/index.ts";

export function Sync(): ReactElement {
  const { t } = useWords("switch");

  return (
    <Field.Root>
      <Switch.Root name="sync" spread>
        <Switch.Label>{t("sync")}</Switch.Label>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>
      <Field.HelperText>{t("devices")}</Field.HelperText>
    </Field.Root>
  );
}
