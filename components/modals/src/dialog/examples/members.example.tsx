import { type ReactElement, useState } from "react";
import { createPortal } from "react-dom";

import { XIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { DataList } from "@stealthscale/component-collections";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Dialog from "#dialog/index.ts";

const MEMBERS = ["ada", "grace", "alan"] as const;

const DETAILS = ["email", "role", "joined"] as const;

const LISTED = { variant: "ghost" } as const;

export function Members(): ReactElement {
  const { t } = useWords("dialog");
  const [viewed, setViewed] = useState<null | string>(null);
  const person = MEMBERS.find((member) => member === viewed) ?? "ada";

  return (
    <Dialog.Root
      onTriggerValueChange={({ value }) => {
        setViewed(value);
      }}
      triggerValue={viewed}
    >
      <Stack align="flex-start" gap="xs">
        <ButtonPropsProvider value={LISTED}>
          {MEMBERS.map((member) => (
            <Dialog.Trigger as={Button} key={member} value={member}>
              {t(`members.people.${member}.name`)}
            </Dialog.Trigger>
          ))}
        </ButtonPropsProvider>
      </Stack>
      {createPortal(
        <>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{t(`members.people.${person}.name`)}</Dialog.Title>
                <Dialog.Description>{t(`members.people.${person}.title`)}</Dialog.Description>
              </Dialog.Header>
              <Dialog.Body>
                <DataList.Root>
                  {DETAILS.map((detail) => (
                    <DataList.Item key={detail}>
                      <DataList.ItemLabel>{t(`members.labels.${detail}`)}</DataList.ItemLabel>
                      <DataList.ItemValue>
                        {t(`members.people.${person}.${detail}`)}
                      </DataList.ItemValue>
                    </DataList.Item>
                  ))}
                </DataList.Root>
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
