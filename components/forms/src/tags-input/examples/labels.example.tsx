import { type ReactElement } from "react";

import { XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as TagsInput from "#tags-input/index.ts";

const PALETTES: Readonly<Record<string, TagsInput.ItemPreviewProps["palette"]>> = {
  bug: "error",
  design: "accent",
  docs: "info",
  feature: "primary",
};

export function Labels(): ReactElement {
  const { t } = useWords("tags-input");

  return (
    <TagsInput.Root
      defaultValue={["bug", "design"]}
      placeholder={t("label")}
      sanitizeValue={(text) => text.trim().toLowerCase()}
    >
      <TagsInput.Label>{t("labels")}</TagsInput.Label>
      <TagsInput.Control>
        <TagsInput.Items>
          {(value, index) => (
            <TagsInput.Item index={index} value={value}>
              <TagsInput.ItemPreview palette={PALETTES[value] ?? "neutral"} variant="subtle">
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
  );
}
