import { type ReactElement, useState } from "react";
import { createPortal } from "react-dom";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Progress } from "@stealthscale/component-feedback";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Dialog from "#dialog/index.ts";
import { createOverlay } from "#overlay/index.ts";

const OUTLINED = { variant: "outline" } as const;

interface Uploading {
  readonly cancel: string;
  readonly label: string;
  readonly title: string;
  readonly value: number;
}

const uploading = createOverlay<Uploading, "done">(
  ({ cancel, close: _close, label, title, value, ...props }) => (
    <Dialog.Root {...props}>
      {createPortal(
        <>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{title}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Progress.Root value={value}>
                  <Progress.Label>{label}</Progress.Label>
                  <Progress.ValueText />
                  <Progress.Track>
                    <Progress.Range />
                  </Progress.Track>
                </Progress.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <ButtonPropsProvider value={OUTLINED}>
                  <Dialog.ActionTrigger as={Button}>{cancel}</Dialog.ActionTrigger>
                </ButtonPropsProvider>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </>,
        document.body,
      )}
    </Dialog.Root>
  ),
);

export function Upload(): ReactElement {
  const { t } = useWords("overlay");
  const [done, setDone] = useState<boolean>();

  const upload = async (): Promise<void> => {
    const timer = globalThis.setInterval(() => {
      const { value } = uploading.get("upload");

      if (value < 100) uploading.update("upload", { value: value + 10 });
      else void uploading.close("upload", "done");
    }, 400);
    const result = await uploading.open("upload", {
      cancel: t("cancel"),
      label: t("upload.label"),
      title: t("upload.title"),
      value: 0,
    });

    globalThis.clearInterval(timer);
    setDone(result === "done");
  };

  return (
    <Stack align="flex-start" gap="sm">
      <Button
        onClick={() => {
          void upload();
        }}
      >
        {t("upload.trigger")}
      </Button>
      <uploading.Viewport />
      <Text as="output" tone="muted">
        {done === undefined ? null : t(done ? "upload.done" : "upload.stopped")}
      </Text>
    </Stack>
  );
}
