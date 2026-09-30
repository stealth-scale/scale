import { type ReactElement, useState } from "react";

import { Field } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import { Markdown } from "#markdown/index.ts";

export function Preview(): ReactElement {
  const { t } = useWords("markdown");
  const [source, setSource] = useState(t("preview.source"));

  return (
    <Stack gap="lg">
      <Field.Root>
        <Field.Label>{t("preview.label")}</Field.Label>
        <Field.Textarea
          grows
          maxRows={12}
          onChange={(event) => {
            setSource(event.target.value);
          }}
          rows={6}
          value={source}
        />
      </Field.Root>
      <Markdown headingLevel={2} size="sm" source={source} />
    </Stack>
  );
}
