import { type ReactElement, useId, useState } from "react";
import { createPortal } from "react-dom";

import { CircleAlertIcon, XIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Field } from "@stealthscale/component-forms";
import { useWords } from "@stealthscale/specimen";

import * as Dialog from "#dialog/index.ts";

const OUTLINED = { variant: "outline" } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

export function Invite(): ReactElement {
  const { t } = useWords("dialog");
  const form = useId();
  const [open, setOpen] = useState(false);
  const [invalid, setInvalid] = useState(false);

  return (
    <Dialog.Root
      onOpenChange={({ open: next }) => {
        setOpen(next);
        setInvalid(false);
      }}
      open={open}
    >
      <Dialog.Trigger as={Button}>{t("invite.trigger")}</Dialog.Trigger>
      {createPortal(
        <>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{t("invite.title")}</Dialog.Title>
                <Dialog.Description>{t("invite.description")}</Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <form
                  id={form}
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault();
                    const email = new FormData(event.currentTarget).get("email");
                    const valid = typeof email === "string" && EMAIL.test(email);
                    setInvalid(!valid);
                    if (valid) setOpen(false);
                  }}
                >
                  <Field.Root invalid={invalid} required>
                    <Field.Label>{t("invite.email")}</Field.Label>
                    <Field.Control name="email" type="email" />
                    <Field.ErrorText>
                      <CircleAlertIcon />
                      {t("invite.check")}
                    </Field.ErrorText>
                  </Field.Root>
                </form>
              </Dialog.Body>
              <Dialog.Footer>
                <ButtonPropsProvider value={OUTLINED}>
                  <Dialog.ActionTrigger as={Button}>{t("cancel")}</Dialog.ActionTrigger>
                </ButtonPropsProvider>
                <Button form={form} type="submit">
                  {t("invite.send")}
                </Button>
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
