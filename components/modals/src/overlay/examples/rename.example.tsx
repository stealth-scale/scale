import { type ReactElement, useId, useState } from "react";
import { createPortal } from "react-dom";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Field } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Dialog from "#dialog/index.ts";
import { createOverlay } from "#overlay/index.ts";

const OUTLINED = { variant: "outline" } as const;

interface Naming {
  readonly cancel: string;
  readonly form: string;
  readonly label: string;
  readonly name: string;
  readonly save: string;
  readonly title: string;
}

const renaming = createOverlay<Naming, string>(
  ({ cancel, close, form, label, name, save, title, ...props }) => (
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
                <form
                  id={form}
                  onSubmit={(event) => {
                    event.preventDefault();
                    const next = new FormData(event.currentTarget).get("name");
                    if (typeof next === "string") close(next.trim());
                  }}
                >
                  <Field.Root required>
                    <Field.Label>{label}</Field.Label>
                    <Field.Control defaultValue={name} name="name" />
                  </Field.Root>
                </form>
              </Dialog.Body>
              <Dialog.Footer>
                <ButtonPropsProvider value={OUTLINED}>
                  <Dialog.ActionTrigger as={Button}>{cancel}</Dialog.ActionTrigger>
                </ButtonPropsProvider>
                <Button form={form} type="submit">
                  {save}
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

export function Rename(): ReactElement {
  const { t } = useWords("overlay");
  const form = useId();
  const [name, setName] = useState(t("rename.name"));

  const ask = async (): Promise<void> => {
    const next = await renaming.open("rename", {
      cancel: t("cancel"),
      form,
      label: t("rename.label"),
      name,
      save: t("rename.save"),
      title: t("rename.title"),
    });

    if (next !== undefined && next !== "") setName(next);
  };

  return (
    <Stack align="baseline" direction="row" gap="sm" wrap>
      <Text as="span" weight="medium">
        {name}
      </Text>
      <Button
        onClick={() => {
          void ask();
        }}
        size="sm"
        variant="outline"
      >
        {t("rename.trigger")}
      </Button>
      <renaming.Viewport />
    </Stack>
  );
}
