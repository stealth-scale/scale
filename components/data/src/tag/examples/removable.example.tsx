import { type ReactElement } from "react";

import { XIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Tag from "#tag/index.ts";

export function Removable(props: Tag.RootProps): ReactElement {
  const { t } = useWords("tag");

  return (
    <Tag.Root {...props}>
      <Tag.Label>{t("words.payouts")}</Tag.Label>
      <Tag.CloseTrigger aria-label={t("remove", { name: t("words.payouts") })}>
        <XIcon aria-hidden />
      </Tag.CloseTrigger>
    </Tag.Root>
  );
}
