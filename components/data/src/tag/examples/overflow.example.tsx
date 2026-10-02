import { type ReactElement } from "react";

import { XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Tag from "#tag/index.ts";

export function Overflow(): ReactElement {
  const { t } = useWords("tag");

  return (
    <Tag.Root palette="info">
      <Tag.Label>{t("words.long")}</Tag.Label>
      <Tag.CloseTrigger aria-label={t("remove", { name: t("words.long") })}>
        <XIcon aria-hidden />
      </Tag.CloseTrigger>
    </Tag.Root>
  );
}
