import { type ReactElement } from "react";

import { CheckIcon, ExternalLinkIcon, HashIcon, TriangleAlertIcon } from "lucide-react";

import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Tag from "#tag/index.ts";

export function Marks(): ReactElement {
  const { t } = useWords("tag");

  return (
    <Stack direction="row" gap="sm" wrap>
      <Tag.Root palette="info">
        <Tag.StartElement>
          <HashIcon aria-hidden />
        </Tag.StartElement>
        <Tag.Label>{t("words.payouts")}</Tag.Label>
      </Tag.Root>
      <Tag.Root palette="success">
        <Tag.Label>{t("words.reconciled")}</Tag.Label>
        <Tag.EndElement>
          <CheckIcon aria-hidden />
        </Tag.EndElement>
      </Tag.Root>
      <Tag.Root palette="warning">
        <Tag.StartElement>
          <TriangleAlertIcon aria-hidden />
        </Tag.StartElement>
        <Tag.Label>{t("words.review")}</Tag.Label>
        <Tag.EndElement>
          <ExternalLinkIcon aria-hidden />
        </Tag.EndElement>
      </Tag.Root>
    </Stack>
  );
}
