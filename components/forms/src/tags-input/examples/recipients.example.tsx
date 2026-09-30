import { type ReactElement, useState } from "react";

import { CircleAlertIcon, XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as TagsInput from "#tags-input/index.ts";

const ADDRESS = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

export function Recipients(): ReactElement {
  const { t } = useWords("tags-input");
  const [refused, setRefused] = useState(false);

  return (
    <Field.Root invalid={refused}>
      <Field.Label>{t("recipients")}</Field.Label>
      <TagsInput.Root
        blurBehavior="add"
        defaultValue={[t("ada")]}
        onInputValueChange={() => {
          setRefused(false);
        }}
        onValueInvalid={() => {
          setRefused(true);
        }}
        validate={({ inputValue }) => ADDRESS.test(inputValue)}
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
              </TagsInput.Item>
            )}
          </TagsInput.Items>
          <TagsInput.Input />
        </TagsInput.Control>
      </TagsInput.Root>
      <Field.HelperText>{t("enter")}</Field.HelperText>
      <Field.ErrorText>
        <CircleAlertIcon />
        {t("unknown")}
      </Field.ErrorText>
    </Field.Root>
  );
}
