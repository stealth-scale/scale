import { type ReactElement } from "react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Group } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as RovingFocus from "#roving-focus/index.ts";

const OUTLINE = { variant: "outline" } as const;

export function Formatting(): ReactElement {
  const { t } = useWords("roving-focus");

  return (
    <RovingFocus.Root aria-label={t("formatting")} role="toolbar" wrap>
      <ButtonPropsProvider value={OUTLINE}>
        <Group attached>
          <RovingFocus.Item as={Button}>{t("bold")}</RovingFocus.Item>
          <RovingFocus.Item as={Button}>{t("italic")}</RovingFocus.Item>
          <RovingFocus.Item as={Button}>{t("underline")}</RovingFocus.Item>
        </Group>
      </ButtonPropsProvider>
    </RovingFocus.Root>
  );
}
