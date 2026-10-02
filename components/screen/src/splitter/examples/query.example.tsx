import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { ScrollArea } from "@stealthscale/component-primitives";
import { Code, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Splitter from "#splitter/index.ts";

const ROWS = ["ada", "grace", "katherine", "margaret"] as const;

export function Query(): ReactElement {
  const { t } = useWords("splitter");
  const splitter = Splitter.useSplitter({
    defaultSize: [40, 60],
    keyboardResizeBy: 5,
    orientation: "vertical",
    panels: [
      { collapsedSize: 0, collapsible: true, id: "query", minSize: 20 },
      { id: "results", minSize: 30 },
    ],
  });

  return (
    <Splitter.Root splitter={splitter}>
      <Splitter.Panel id="query">
        <ScrollArea.Root inset="md" scrolls="both">
          <ScrollArea.Viewport aria-label={t("query.editor")}>
            <ScrollArea.Content>
              <Stack gap="xs">
                <Text weight="semibold">{t("query.editor")}</Text>
                <Code>{t("query.statement")}</Code>
              </Stack>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
          <ScrollArea.Scrollbar orientation="horizontal" />
          <ScrollArea.Corner />
        </ScrollArea.Root>
      </Splitter.Panel>
      <Splitter.ResizeTrigger id="query:results" label={t("query.resize")} />
      <Splitter.Panel id="results">
        <ScrollArea.Root inset="md">
          <ScrollArea.Viewport aria-label={t("query.results")}>
            <ScrollArea.Content>
              <Stack gap="xs">
                <Text weight="semibold">{t("query.results")}</Text>
                {ROWS.map((row) => (
                  <Text key={row} size="sm">
                    {t(`query.rows.${row}`)}
                  </Text>
                ))}
              </Stack>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>
      </Splitter.Panel>
    </Splitter.Root>
  );
}
