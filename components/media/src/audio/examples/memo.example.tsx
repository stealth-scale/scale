import { type ReactElement } from "react";

import { ChevronDownIcon } from "lucide-react";

import { Collapsible } from "@stealthscale/component-disclosure";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import { Audio } from "#audio/index.ts";

import memo from "./memo.webm";

export function Memo(): ReactElement {
  const { t } = useWords("audio");

  return (
    <Stack gap="sm">
      <Text as="span" weight="medium">
        {t("memo.title")}
      </Text>
      <Audio aria-label={t("memo.title")} preload="metadata" src={memo} />
      <Collapsible.Root>
        <Collapsible.Trigger>
          {t("memo.transcript")}
          <Collapsible.Indicator>
            <ChevronDownIcon size="100%" />
          </Collapsible.Indicator>
        </Collapsible.Trigger>
        <Collapsible.Content>{t("memo.words")}</Collapsible.Content>
      </Collapsible.Root>
    </Stack>
  );
}
