import { type ReactElement, useId, useState } from "react";
import { createPortal } from "react-dom";

import { CircleAlertIcon, PlusIcon, XIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Field } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Drawer from "#drawer/index.ts";

const OUTLINED = { variant: "outline" } as const;

export function Task(): ReactElement {
  const { t } = useWords("drawer");
  const form = useId();
  const [open, setOpen] = useState(false);
  const [invalid, setInvalid] = useState(false);

  return (
    <Drawer.Root
      onOpenChange={({ open: next }) => {
        setOpen(next);
        setInvalid(false);
      }}
      open={open}
      size="md"
    >
      <Drawer.Trigger as={Button}>
        <PlusIcon />
        {t("task.trigger")}
      </Drawer.Trigger>
      {createPortal(
        <>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>{t("task.title")}</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <form
                  id={form}
                  noValidate
                  onSubmit={(event) => {
                    event.preventDefault();
                    const title = new FormData(event.currentTarget).get("title");
                    const valid = typeof title === "string" && title.trim() !== "";
                    setInvalid(!valid);
                    if (valid) setOpen(false);
                  }}
                >
                  <Stack gap="lg">
                    <Field.Root invalid={invalid} required>
                      <Field.Label>{t("task.name")}</Field.Label>
                      <Field.Control name="title" />
                      <Field.ErrorText>
                        <CircleAlertIcon />
                        {t("task.check")}
                      </Field.ErrorText>
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>{t("task.notes")}</Field.Label>
                      <Field.Textarea name="notes" rows={4} />
                    </Field.Root>
                  </Stack>
                </form>
              </Drawer.Body>
              <Drawer.Footer>
                <ButtonPropsProvider value={OUTLINED}>
                  <Drawer.ActionTrigger as={Button}>{t("cancel")}</Drawer.ActionTrigger>
                </ButtonPropsProvider>
                <Button form={form} type="submit">
                  {t("task.create")}
                </Button>
              </Drawer.Footer>
              <Drawer.CloseTrigger aria-label={t("close")}>
                <XIcon />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </>,
        document.body,
      )}
    </Drawer.Root>
  );
}
