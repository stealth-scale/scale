import { type ReactElement } from "react";

import { HashIcon, XIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Tag from "#tag/index.ts";

export function Sizes(props: Tag.RootProps): ReactElement {
  const { t } = useWords("tag");

  return (
    <Stack direction="row" gap="sm" wrap>
      <Tag.Root {...props}>
        <Tag.Label>{t("words.ledger")}</Tag.Label>
      </Tag.Root>
      <Tag.Root {...props}>
        <Tag.StartElement>
          <HashIcon aria-hidden />
        </Tag.StartElement>
        <Tag.Label>{t("words.payouts")}</Tag.Label>
      </Tag.Root>
      <Tag.Root {...props}>
        <Tag.Label>{t("words.archived")}</Tag.Label>
        <Tag.CloseTrigger aria-label={t("remove", { name: t("words.archived") })}>
          <XIcon aria-hidden />
        </Tag.CloseTrigger>
      </Tag.Root>
    </Stack>
  );
}
