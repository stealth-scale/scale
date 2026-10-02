import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { ScrollArea } from "@stealthscale/component-primitives";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Splitter from "#splitter/index.ts";

function pane(title: string, text: string): ReactElement {
  return (
    <ScrollArea.Root inset="md">
      <ScrollArea.Viewport aria-label={title}>
        <ScrollArea.Content>
          <Stack gap="xs">
            <Text weight="semibold">{title}</Text>
            <Text size="sm" tone="muted">
              {text}
            </Text>
          </Stack>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  );
}

export function Basic(props: Omit<Splitter.RootProps, "splitter">): ReactElement {
  const { t } = useWords("splitter");
  const splitter = Splitter.useSplitter({
    defaultSize: [40, 60],
    panels: [
      { id: "offers", minSize: 25 },
      { id: "detail", minSize: 30 },
    ],
  });

  return (
    <Splitter.Root splitter={splitter} {...props}>
      <Splitter.Panel id="offers">{pane(t("basic.offers"), t("basic.waiting"))}</Splitter.Panel>
      <Splitter.ResizeTrigger id="offers:detail" label={t("basic.resize")} />
      <Splitter.Panel id="detail">{pane(t("basic.detail"), t("basic.empty"))}</Splitter.Panel>
    </Splitter.Root>
  );
}
