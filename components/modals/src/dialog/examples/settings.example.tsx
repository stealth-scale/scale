import { type ReactElement, useState } from "react";
import { createPortal } from "react-dom";

import { XIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Dialog from "#dialog/index.ts";

const OUTLINED = { variant: "outline" } as const;

const DESTRUCTIVE = { palette: "error" } as const;

const WARNING = { palette: "error", variant: "outline" } as const;

type Word = "cancel" | "confirm" | "description" | "title" | "trigger";

function deletion(word: (key: Word) => string, onDelete: () => void): ReactElement {
  return (
    <Dialog.Root role="alertdialog" size="sm">
      <ButtonPropsProvider value={WARNING}>
        <Dialog.Trigger as={Button}>{word("trigger")}</Dialog.Trigger>
      </ButtonPropsProvider>
      {createPortal(
        <>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{word("title")}</Dialog.Title>
                <Dialog.Description>{word("description")}</Dialog.Description>
              </Dialog.Header>
              <Dialog.Footer>
                <ButtonPropsProvider value={OUTLINED}>
                  <Dialog.ActionTrigger as={Button}>{word("cancel")}</Dialog.ActionTrigger>
                </ButtonPropsProvider>
                <ButtonPropsProvider value={DESTRUCTIVE}>
                  <Dialog.ActionTrigger as={Button} onClick={onDelete}>
                    {word("confirm")}
                  </Dialog.ActionTrigger>
                </ButtonPropsProvider>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </>,
        document.body,
      )}
    </Dialog.Root>
  );
}

export function Settings(): ReactElement {
  const { t } = useWords("dialog");
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root
      onOpenChange={({ open: next }) => {
        setOpen(next);
      }}
      open={open}
    >
      <Dialog.Trigger as={Button}>{t("settings.trigger")}</Dialog.Trigger>
      {createPortal(
        <>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{t("settings.title")}</Dialog.Title>
                <Dialog.Description>{t("settings.description")}</Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <Stack align="flex-start" gap="md">
                  <Text>{t("settings.danger")}</Text>
                  {deletion(
                    (key) => t(`settings.deletion.${key}`),
                    () => {
                      setOpen(false);
                    },
                  )}
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
