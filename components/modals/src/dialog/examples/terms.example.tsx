import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Heading, Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Dialog from "#dialog/index.ts";

const SECTIONS = [
  "accounts",
  "billing",
  "content",
  "privacy",
  "termination",
  "liability",
  "changes",
  "contact",
] as const;

export function Terms(props: Dialog.RootProps): ReactElement {
  const { t } = useWords("dialog");

  return (
    <Dialog.Root {...props}>
      <Dialog.Trigger as={Button}>{t("terms.trigger")}</Dialog.Trigger>
      {createPortal(
        <>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{t("terms.title")}</Dialog.Title>
                <Dialog.Description>{t("terms.updated")}</Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <Stack gap="lg">
                  {SECTIONS.map((section) => (
                    <Stack as="section" gap="xs" key={section}>
                      <Heading as="h3" size="sm">
                        {t(`terms.sections.${section}.title`)}
                      </Heading>
                      <Text>{t(`terms.sections.${section}.body`)}</Text>
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
