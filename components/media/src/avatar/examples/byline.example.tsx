import { type ReactElement } from "react";

import { Span, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Avatar from "#avatar/index.ts";

import ada from "./ada.webp";

export function Byline(): ReactElement {
  const { t } = useWords("avatar");

  return (
    <Text size="sm">
      <Avatar.Root aria-hidden name={t("ada")} size="2xs">
        <Avatar.Fallback />
        <Avatar.Image src={ada} />
      </Avatar.Root>{" "}
      <Span weight="semibold">{t("ada")}</Span> <Span tone="muted">{t("commented")}</Span>
    </Text>
  );
}
