import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Kbd, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Dialog from "#dialog/index.ts";

const SHORTCUTS = [
  { command: "palette", keys: ["⌘", "K"] },
  { command: "search", keys: ["/"] },
  { command: "save", keys: ["⌘", "S"] },
  { command: "undo", keys: ["⌘", "Z"] },
] as const;

export function Shortcuts(props: Dialog.RootProps): ReactElement {
  const { t } = useWords("dialog");

  return (
    <Dialog.Root {...props}>
      <Dialog.Trigger as={Button}>{t("shortcuts.trigger")}</Dialog.Trigger>
      {createPortal(
        <>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{t("shortcuts.title")}</Dialog.Title>
                <Dialog.Description>{t("shortcuts.description")}</Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap="sm">
                  {SHORTCUTS.map(({ command, keys }) => (
                    <Stack direction="row" justify="between" key={command}>
                      <Text>{t(`shortcuts.commands.${command}`)}</Text>
                      <Kbd.Group>
                        {keys.map((key) => (
                          <Kbd.Root key={key}>{key}</Kbd.Root>
                        ))}
                      </Kbd.Group>
                    </Stack>
                  ))}
                </Stack>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger as={Button}>{t("done")}</Dialog.ActionTrigger>
              </Dialog.Footer>
              <Dialog.CloseTrigger aria-label={t("close")}>
                <XIcon />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </>,
        document.body,
      )}
    </Dialog.Root>
  );
}
