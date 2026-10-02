import { type ReactElement, useState } from "react";

import { CircleAlertIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Editable from "#editable/index.ts";
import * as Field from "#field/index.ts";

export function Display(): ReactElement {
  const { t } = useWords("editable");
  const [empty, setEmpty] = useState(false);

  return (
    <Field.Root invalid={empty} required>
      <Field.Label>{t("display")}</Field.Label>
      <Editable.Root
        defaultValue={t("ada")}
        onValueCommit={({ value }) => {
          setEmpty(value.trim() === "");
        }}
        placeholder={t("nameless")}
      >
        <Editable.Area>
          <Editable.Preview />
          <Editable.Input />
        </Editable.Area>
      </Editable.Root>
      <Field.HelperText>{t("shown")}</Field.HelperText>
      <Field.ErrorText>
        <CircleAlertIcon />
        {t("needed")}
      </Field.ErrorText>
    </Field.Root>
  );
}
