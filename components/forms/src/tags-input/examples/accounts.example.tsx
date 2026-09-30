import { type ReactElement } from "react";

import { CircleXIcon, XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as TagsInput from "#tags-input/index.ts";

export function Accounts(props: TagsInput.RootProps): ReactElement {
  const { t } = useWords("tags-input");

  return (
    <TagsInput.Root defaultValue={[t("bridge"), t("halden")]} placeholder={t("add")} {...props}>
      <TagsInput.Label>{t("accounts")}</TagsInput.Label>
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
  );
}
