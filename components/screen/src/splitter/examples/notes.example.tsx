import { type ReactElement } from "react";

import { FileTextIcon, PanelLeftIcon } from "lucide-react";

import { IconButton } from "@stealthscale/component-actions";
import { Group, Stack } from "@stealthscale/component-layout";
import { NavList } from "@stealthscale/component-navigation";
import { ScrollArea } from "@stealthscale/component-primitives";
import { Heading, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Splitter from "#splitter/index.ts";

const NOTES = ["launch", "hiring", "budget", "offsite"] as const;

export function Notes(): ReactElement {
  const { t } = useWords("splitter");
  const splitter = Splitter.useSplitter({
    defaultSize: [30, 70],
    panels: [
      { collapsedSize: 0, collapsible: true, id: "notes", maxSize: 50, minSize: 20 },
      { id: "note", minSize: 40 },
    ],
  });
  const shown = splitter.isPanelExpanded("notes");

  return (
    <Splitter.Root splitter={splitter}>
      <Splitter.Panel id="notes">
        <ScrollArea.Root inset="xs">
          <ScrollArea.Viewport focusable={false}>
            <ScrollArea.Content>
              <NavList.Root size="sm">
                {NOTES.map((note) => (
                  <NavList.Item key={note}>
                    <NavList.Link
                      aria-current={note === "launch" ? "page" : undefined}
                      href="#note"
                    >
                      <FileTextIcon aria-hidden />
                      <span>{t(`notes.titles.${note}`)}</span>
                    </NavList.Link>
                  </NavList.Item>
                ))}
              </NavList.Root>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>
      </Splitter.Panel>
      <Splitter.ResizeTrigger id="notes:note" label={t("notes.resize")} />
      <Splitter.Panel id="note">
        <ScrollArea.Root inset="md">
          <ScrollArea.Viewport aria-label={t("notes.titles.launch")}>
            <ScrollArea.Content>
              <Stack gap="sm">
                <Group gap="sm">
                  <IconButton
                    aria-expanded={shown}
                    aria-label={t("notes.list")}
                    onClick={() => {
                      if (shown) splitter.collapsePanel("notes");
                      else splitter.expandPanel("notes");
                    }}
                    size="sm"
                    variant="ghost"
                  >
                    <PanelLeftIcon />
                  </IconButton>
                  <Heading as="h3" size="sm">
                    {t("notes.titles.launch")}
                  </Heading>
                </Group>
                <Text size="sm">{t("notes.body")}</Text>
              </Stack>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>
      </Splitter.Panel>
    </Splitter.Root>
  );
}
