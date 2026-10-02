import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { CheckIcon, SlidersHorizontalIcon, XIcon } from "lucide-react";

import { Button, ButtonPropsProvider } from "@stealthscale/component-actions";
import { Checkbox, Fieldset } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { useWords } from "@stealthscale/specimen";

import * as Drawer from "#drawer/index.ts";

const OUTLINED = { variant: "outline" } as const;

const STATUSES = ["paid", "overdue", "draft"] as const;

export function Filters(props: Drawer.RootProps): ReactElement {
  const { t } = useWords("drawer");

  return (
    <Drawer.Root {...props}>
      <ButtonPropsProvider value={OUTLINED}>
        <Drawer.Trigger as={Button}>
          <SlidersHorizontalIcon />
          {t("filters.trigger")}
        </Drawer.Trigger>
      </ButtonPropsProvider>
      {createPortal(
        <>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>{t("filters.title")}</Drawer.Title>
                <Drawer.Description>{t("filters.description")}</Drawer.Description>
              </Drawer.Header>
              <Drawer.Body>
                <Fieldset.Root>
                  <Fieldset.Legend>{t("filters.status")}</Fieldset.Legend>
                  <Stack gap="sm">
                    {STATUSES.map((status) => (
                      <Checkbox.Root defaultChecked={status !== "draft"} key={status}>
                        <Checkbox.Control>
                          <Checkbox.Indicator>
                            <CheckIcon strokeWidth={3} />
                          </Checkbox.Indicator>
                        </Checkbox.Control>
                        <Checkbox.Label>{t(`filters.statuses.${status}`)}</Checkbox.Label>
                      </Checkbox.Root>
                    ))}
                  </Stack>
                </Fieldset.Root>
              </Drawer.Body>
              <Drawer.Footer>
                <ButtonPropsProvider value={OUTLINED}>
                  <Drawer.ActionTrigger as={Button}>{t("cancel")}</Drawer.ActionTrigger>
                </ButtonPropsProvider>
                <Drawer.ActionTrigger as={Button}>{t("filters.apply")}</Drawer.ActionTrigger>
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
