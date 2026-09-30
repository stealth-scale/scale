import { type ReactElement, useState } from "react";

import { XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as TagsInput from "#tags-input/index.ts";

const MOST = 5;

export function Keywords(): ReactElement {
  const { t } = useWords("tags-input");
  const [keywords, setKeywords] = useState(() => [t("pricing"), t("invoices")]);

  return (
    <Field.Root>
      <Field.Label>{t("keywords")}</Field.Label>
      <TagsInput.Root
        editable
        max={MOST}
        onValueChange={({ value }) => {
          setKeywords(value);
        }}
        value={keywords}
      >
        <TagsInput.Control>
          <TagsInput.Items>
            {(value, index) => (
              <TagsInput.Item index={index} value={value}>
                <TagsInput.ItemPreview>
                  <TagsInput.ItemText />
                  <TagsInput.ItemDeleteTrigger label={t("remove", { value })}>
                    <XIcon />
                  </TagsInput.ItemDeleteTrigger>
                </TagsInput.ItemPreview>
                <TagsInput.ItemInput label={t("edit", { value })} />
              </TagsInput.Item>
            )}
          </TagsInput.Items>
          <TagsInput.Input />
        </TagsInput.Control>
      </TagsInput.Root>
      <Field.HelperText>{t("used", { most: MOST, used: keywords.length })}</Field.HelperText>
    </Field.Root>
  );
}
