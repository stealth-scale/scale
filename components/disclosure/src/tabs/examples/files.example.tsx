import { type ReactElement, useState } from "react";

import { FileCodeIcon, FolderOpenIcon, XIcon } from "lucide-react";

import { VisuallyHidden } from "@stealthscale/component-a11y";
import { Button } from "@stealthscale/component-actions";
import { Status } from "@stealthscale/component-data";
import { EmptyState } from "@stealthscale/component-feedback";
import { ScrollArea } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/specimen";

import * as Tabs from "#tabs/index.ts";

const FILES = ["deploy", "build", "release", "nightly"];

const UNSAVED = "release";

function emptied(t: ReturnType<typeof useWords>["t"], onReopen: () => void): ReactElement {
  return (
    <EmptyState.Root size="sm">
      <EmptyState.Content>
        <EmptyState.Indicator>
          <FolderOpenIcon />
        </EmptyState.Indicator>
        <EmptyState.Title as="h3">{t("files.empty.title")}</EmptyState.Title>
        <EmptyState.Description>{t("files.empty.about")}</EmptyState.Description>
        <Button onClick={onReopen} size="sm" variant="outline">
          {t("files.empty.reopen")}
        </Button>
      </EmptyState.Content>
    </EmptyState.Root>
  );
}

export function Files(): ReactElement {
  const { t } = useWords("tabs");
  const [open, setOpen] = useState(FILES);

  if (open.length === 0) {
    return emptied(t, () => {
      setOpen(FILES);
    });
  }

  return (
    <Tabs.Root
      defaultValue="build"
      onClose={({ value }) => {
        setOpen((was) => was.filter((file) => file !== value));
      }}
    >
      <ScrollArea.Root fade inset="xs" scrolls="horizontal">
        <ScrollArea.Viewport focusable={false}>
          <ScrollArea.Content>
            <Tabs.List aria-label={t("files.label")}>
              {open.map((file) => (
                <Tabs.Trigger closable key={file} value={file}>
                  <FileCodeIcon />
                  {t(`files.names.${file}`)}
                  {file === UNSAVED ? (
                    <Status.Root palette="warning" size="inherit">
                      <Status.Indicator />
                      <VisuallyHidden>{t("files.unsaved")}</VisuallyHidden>
                    </Status.Root>
                  ) : null}
                  <Tabs.CloseTrigger label={t("files.close")}>
                    <XIcon />
                  </Tabs.CloseTrigger>
                </Tabs.Trigger>
              ))}
              <Tabs.Indicator />
            </Tabs.List>
          </ScrollArea.Content>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" />
      </ScrollArea.Root>
      {open.map((file) => (
        <Tabs.Content key={file} value={file}>
          {t(`files.about.${file}`)}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
