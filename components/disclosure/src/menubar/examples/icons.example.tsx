import { type ReactElement } from "react";

import {
  ArchiveIcon,
  CopyIcon,
  FolderInputIcon,
  FolderPlusIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";

import { Portal } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/specimen";

import * as Menu from "#menu/index.ts";
import * as Menubar from "#menubar/index.ts";

export function Icons(): ReactElement {
  const { t } = useWords("menubar");

  return (
    <Menubar.Root aria-label={t("mailbox")}>
      <Menubar.Menu inset value="message">
        <Menubar.Trigger>{t("message")}</Menubar.Trigger>
        <Portal>
          <Menubar.Content>
            <Menu.Item value="duplicate">
              <CopyIcon aria-hidden />
              {t("duplicate")}
            </Menu.Item>
            <Menu.Item value="move">
              <FolderInputIcon aria-hidden />
              {t("move")}
            </Menu.Item>
            <Menu.Item value="archive">
              <ArchiveIcon aria-hidden />
              {t("archive")}
            </Menu.Item>
            <Menu.Item value="unread">{t("unread")}</Menu.Item>
            <Menu.Separator />
            <Menu.Item tone="critical" value="delete">
              <Trash2Icon aria-hidden />
              {t("delete")}
            </Menu.Item>
          </Menubar.Content>
        </Portal>
      </Menubar.Menu>
      <Menubar.Menu value="folder">
        <Menubar.Trigger>{t("folder")}</Menubar.Trigger>
        <Portal>
          <Menubar.Content>
            <Menu.Item value="create">
              <FolderPlusIcon aria-hidden />
              {t("create")}
            </Menu.Item>
            <Menu.Item value="rename">
              <PencilIcon aria-hidden />
              {t("rename")}
            </Menu.Item>
          </Menubar.Content>
        </Portal>
      </Menubar.Menu>
    </Menubar.Root>
  );
}
