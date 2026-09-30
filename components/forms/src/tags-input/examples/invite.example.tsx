import { type ReactElement } from "react";

import { CircleXIcon, XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Field from "#field/index.ts";
import * as TagsInput from "#tags-input/index.ts";

export function Invite(): ReactElement {
  const { t } = useWords("tags-input");

  return (
    <Field.Root>
      <Field.Label>{t("team")}</Field.Label>
      <TagsInput.Root addOnPaste name="invite" placeholder={t("paste")}>
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
          <TagsInput.ClearTrigger label={t("clear")}>
            <CircleXIcon />
          </TagsInput.ClearTrigger>
        </TagsInput.Control>
      </TagsInput.Root>
      <Field.HelperText>{t("pasted")}</Field.HelperText>
    </Field.Root>
  );
}
