import { type ReactElement } from "react";

import { GripHorizontalIcon, XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Field, Switch } from "@stealthscale/component-forms";
import { Group, Stack } from "@stealthscale/component-layout";
import { Portal } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/specimen";

import * as FloatingPanel from "#floating-panel/index.ts";

const FIELDS = [
  { name: "width", value: "1200" },
  { name: "height", value: "630" },
] as const;

export function Inspector(): ReactElement {
  const { t } = useWords("floating-panel");

  return (
    <FloatingPanel.Root
      defaultSize={{ height: 300, width: 280 }}
      getAnchorPosition={({ boundaryRect, triggerRect }) => ({
        x: Math.min(triggerRect?.left ?? 0, (boundaryRect?.width ?? 0) - 288),
        y: Math.min((triggerRect?.bottom ?? 0) + 8, (boundaryRect?.height ?? 0) - 308),
      })}
    >
      <FloatingPanel.Trigger as={Button}>{t("inspector.trigger")}</FloatingPanel.Trigger>
      <Portal>
        <FloatingPanel.Positioner>
          <FloatingPanel.Content>
            <FloatingPanel.Header>
              <FloatingPanel.DragTrigger>
                <GripHorizontalIcon aria-hidden />
                <FloatingPanel.Title>{t("inspector.heading")}</FloatingPanel.Title>
              </FloatingPanel.DragTrigger>
              <FloatingPanel.Control>
                <FloatingPanel.CloseTrigger label={t("close")}>
                  <XIcon />
                </FloatingPanel.CloseTrigger>
              </FloatingPanel.Control>
            </FloatingPanel.Header>
            <FloatingPanel.Body>
              <Stack gap="md">
                <Field.Root>
                  <Field.Label>{t("inspector.name")}</Field.Label>
                  <Field.Control defaultValue={t("inspector.value")} />
                </Field.Root>
                <Group gap="sm">
                  {FIELDS.map(({ name, value }) => (
                    <Field.Root key={name}>
                      <Field.Label>{t(`inspector.${name}`)}</Field.Label>
                      <Field.Control defaultValue={value} inputMode="numeric" />
                    </Field.Root>
                  ))}
                </Group>
                <Switch.Root>
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                  <Switch.Label>{t("inspector.locked")}</Switch.Label>
                </Switch.Root>
              </Stack>
            </FloatingPanel.Body>
            <FloatingPanel.ResizeTriggers />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel.Root>
  );
}
