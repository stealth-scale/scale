import { type ReactElement, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import {
  CopyIcon,
  FilePlusIcon,
  LayoutDashboardIcon,
  SearchIcon,
  SettingsIcon,
  XIcon,
} from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Kbd } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Command from "#command/index.ts";
import * as Dialog from "#dialog/index.ts";

const OUTLINED = { variant: "outline" } as const;

const ACTIONS = [
  { group: "invoices", Icon: FilePlusIcon, shortcut: "⌘N", value: "new" },
  { group: "invoices", Icon: CopyIcon, shortcut: undefined, value: "duplicate" },
  { group: "navigation", Icon: LayoutDashboardIcon, shortcut: "G O", value: "overview" },
  { group: "navigation", Icon: SettingsIcon, shortcut: "G S", value: "settings" },
] as const;

function useShortcut(toggle: () => void): void {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
      event.preventDefault();
      event.stopPropagation();
      toggle();
    }

    window.addEventListener("keydown", onKeyDown, { capture: true });

    return (): void => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, [toggle]);
}

export function Palette(): ReactElement {
  const { t } = useWords("dialog");
  const [open, setOpen] = useState(false);

  useShortcut(() => {
    setOpen((shown) => !shown);
  });

  return (
    <Dialog.Root
      aria-label={t("palette.label")}
      onOpenChange={({ open: next }) => {
        setOpen(next);
      }}
      open={open}
      placement="top"
      scrollBehavior="inside"
      size="lg"
      variant="plain"
    >
      <ButtonPropsProvider value={OUTLINED}>
        <Dialog.Trigger aria-keyshortcuts="Control+K Meta+K" as={Button}>
          <SearchIcon />
          {t("palette.trigger")}
          <Kbd.Root>⌘K</Kbd.Root>
        </Dialog.Trigger>
      </ButtonPropsProvider>
      {createPortal(
        <>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Command.Root
                actions={ACTIONS.map(({ group, Icon, shortcut, value }) => ({
                  group: t(`palette.groups.${group}`),
                  icon: <Icon size="1em" />,
                  label: t(`palette.actions.${value}`),
                  shortcut,
                  value,
                }))}
                aria-label={t("palette.commands")}
                onRun={() => {
                  setOpen(false);
                }}
              >
                <Command.Input
                  indicator={<SearchIcon size="100%" />}
                  placeholder={t("palette.placeholder")}
                >
                  <Command.Clear aria-label={t("palette.clear")}>
                    <XIcon size="100%" />
                  </Command.Clear>
                </Command.Input>
                <Command.List>
                  <Command.Empty>{t("palette.none")}</Command.Empty>
                </Command.List>
              </Command.Root>
            </Dialog.Content>
          </Dialog.Positioner>
        </>,
        document.body,
      )}
    </Dialog.Root>
  );
}
