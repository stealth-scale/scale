import { type ReactElement, useState } from "react";
import { createPortal } from "react-dom";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Dialog from "#dialog/index.ts";
import { createOverlay } from "#overlay/index.ts";

const OUTLINED = { variant: "outline" } as const;

interface Question {
  readonly cancel: string;
  readonly confirm: string;
  readonly description: string;
  readonly title: string;
}

const confirmation = createOverlay<Question, boolean>(
  ({ cancel, close, confirm, description, title, ...props }) => (
    <Dialog.Root role="alertdialog" {...props}>
      {createPortal(
        <>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.Description>{description}</Dialog.Description>
              </Dialog.Header>
              <Dialog.Footer>
                <ButtonPropsProvider value={OUTLINED}>
                  <Dialog.ActionTrigger as={Button}>{cancel}</Dialog.ActionTrigger>
                </ButtonPropsProvider>
                <Button
                  onClick={() => {
                    close(true);
                  }}
                  palette="error"
                >
                  {confirm}
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </>,
        document.body,
      )}
    </Dialog.Root>
  ),
);

export function Confirm(): ReactElement {
  const { t } = useWords("overlay");
  const [deleted, setDeleted] = useState<boolean>();

  const ask = async (): Promise<void> => {
    const confirmed = await confirmation.open("delete", {
      cancel: t("cancel"),
      confirm: t("confirm.confirm"),
      description: t("confirm.description"),
      title: t("confirm.title"),
    });

    setDeleted(confirmed === true);
  };

  return (
    <Stack align="flex-start" gap="sm">
      <Button
        onClick={() => {
          void ask();
        }}
        palette="error"
        variant="outline"
      >
        {t("confirm.trigger")}
      </Button>
      <confirmation.Viewport />
      <Text as="output" tone="muted">
        {deleted === undefined ? null : t(deleted ? "confirm.deleted" : "confirm.kept")}
      </Text>
    </Stack>
  );
}
