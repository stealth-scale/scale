import { type ReactElement } from "react";

import { Stack } from "@stealthscale/component-layout";
import { ScrollArea } from "@stealthscale/component-primitives";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Splitter from "#splitter/index.ts";

const FOLDERS = ["inbox", "sent", "archive"] as const;

const MESSAGES = ["invoice", "standup", "offsite"] as const;

function pane(title: string, lines: readonly string[]): ReactElement {
  return (
    <ScrollArea.Root inset="md">
      <ScrollArea.Viewport aria-label={title}>
        <ScrollArea.Content>
          <Stack gap="xs">
            <Text weight="semibold">{title}</Text>
            {lines.map((line) => (
              <Text key={line} size="sm" tone="muted">
                {line}
              </Text>
            ))}
          </Stack>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar />
    </ScrollArea.Root>
  );
}

export function Mail(): ReactElement {
  const { t } = useWords("splitter");
  const splitter = Splitter.useSplitter({
    defaultSize: ["160px", 35],
    panels: [
      { id: "folders", maxSize: "280px", minSize: "112px", resizeBehavior: "preserve-pixel-size" },
      { id: "messages", minSize: 25 },
      { id: "message", minSize: 30 },
    ],
  });
  const folders = FOLDERS.map((folder) => t(`mail.folders.${folder}`));
  const messages = MESSAGES.map((message) => t(`mail.messages.${message}`));

  return (
    <Splitter.Root splitter={splitter}>
      <Splitter.Panel id="folders">{pane(t("mail.folder"), folders)}</Splitter.Panel>
      <Splitter.ResizeTrigger id="folders:messages" label={t("mail.resizeFolders")} />
      <Splitter.Panel id="messages">{pane(t("mail.inbox"), messages)}</Splitter.Panel>
      <Splitter.ResizeTrigger id="messages:message" label={t("mail.resizeMessages")} />
      <Splitter.Panel id="message">{pane(t("mail.subject"), [t("mail.body")])}</Splitter.Panel>
    </Splitter.Root>
  );
}
