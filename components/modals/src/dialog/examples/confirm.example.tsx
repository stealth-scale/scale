import { type ReactElement, useState } from "react";
import { createPortal } from "react-dom";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Dialog from "#dialog/index.ts";

const OUTLINED = { variant: "outline" } as const;

const DESTRUCTIVE = { palette: "error" } as const;

const WARNING = { palette: "error", variant: "outline" } as const;

export function Confirm(): ReactElement {
  const { t } = useWords("dialog");
  const [deleted, setDeleted] = useState(false);

  return (
    <Stack align="flex-start" gap="sm">
      <Dialog.Root role="alertdialog">
        <ButtonPropsProvider value={WARNING}>
          <Dialog.Trigger as={Button}>{t("confirm.trigger")}</Dialog.Trigger>
        </ButtonPropsProvider>
        {createPortal(
          <>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content>
                <Dialog.Header>
                  <Dialog.Title>{t("confirm.title")}</Dialog.Title>
                  <Dialog.Description>{t("confirm.description")}</Dialog.Description>
                </Dialog.Header>
                <Dialog.Footer>
                  <ButtonPropsProvider value={OUTLINED}>
                    <Dialog.ActionTrigger as={Button}>{t("cancel")}</Dialog.ActionTrigger>
                  </ButtonPropsProvider>
                  <ButtonPropsProvider value={DESTRUCTIVE}>
                    <Dialog.ActionTrigger
                      as={Button}
                      onClick={() => {
                        setDeleted(true);
                      }}
                    >
                      {t("confirm.confirm")}
                    </Dialog.ActionTrigger>
                  </ButtonPropsProvider>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </>,
          document.body,
        )}
      </Dialog.Root>
      <Text as="output" tone="muted">
        {deleted ? t("confirm.done") : null}
      </Text>
    </Stack>
  );
}
