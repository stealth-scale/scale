import { type ReactElement } from "react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Group } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as RovingFocus from "#roving-focus/index.ts";

const OUTLINE = { variant: "outline" } as const;

export function Tools(): ReactElement {
  const { t } = useWords("roving-focus");

  return (
    <RovingFocus.Root aria-label={t("tools")} orientation="vertical" role="toolbar">
      <ButtonPropsProvider value={OUTLINE}>
        <Group attached orientation="vertical">
          <RovingFocus.Item as={Button}>{t("select")}</RovingFocus.Item>
          <RovingFocus.Item as={Button}>{t("draw")}</RovingFocus.Item>
          <RovingFocus.Item as={Button}>{t("erase")}</RovingFocus.Item>
        </Group>
      </ButtonPropsProvider>
    </RovingFocus.Root>
  );
}
