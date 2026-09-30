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

export function Nested(): ReactElement {
  const { t } = useWords("splitter");
  const outer = Splitter.useSplitter({
    defaultSize: [25, 75],
    panels: [{ id: "project", minSize: 15 }, { id: "work" }],
  });
  const inner = Splitter.useSplitter({
    defaultSize: [65, 35],
    orientation: "vertical",
    panels: [{ id: "editor" }, { id: "output", minSize: 20 }],
  });

  return (
    <Splitter.Root splitter={outer}>
      <Splitter.Panel id="project">
        {pane(t("nested.project"), t("nested.projectText"))}
      </Splitter.Panel>
      <Splitter.ResizeTrigger id="project:work" label={t("nested.resizeProject")} />
      <Splitter.Panel id="work">
        <Splitter.Root splitter={inner}>
          <Splitter.Panel id="editor">
            {pane(t("nested.editor"), t("nested.editorText"))}
          </Splitter.Panel>
          <Splitter.ResizeTrigger id="editor:output" label={t("nested.resizeOutput")} />
          <Splitter.Panel id="output">
            {pane(t("nested.output"), t("nested.outputText"))}
          </Splitter.Panel>
        </Splitter.Root>
      </Splitter.Panel>
    </Splitter.Root>
  );
}
