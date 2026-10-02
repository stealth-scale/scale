import { type ReactElement } from "react";

import { Grid } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";

export function Name(): ReactElement {
  const { t } = useWords("field");

  return (
    <Grid.Root columns="2">
      <Grid.Item>
        <Field.Root required>
          <Field.Label>
            {t("given")}
            <Field.RequiredIndicator />
          </Field.Label>
          <Field.Control autoComplete="given-name" />
        </Field.Root>
      </Grid.Item>
      <Grid.Item>
        <Field.Root required>
          <Field.Label>
            {t("family")}
            <Field.RequiredIndicator />
          </Field.Label>
          <Field.Control autoComplete="family-name" />
        </Field.Root>
      </Grid.Item>
    </Grid.Root>
  );
}
