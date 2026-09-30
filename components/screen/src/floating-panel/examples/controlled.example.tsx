import { type ReactElement, useState } from "react";

import { GripHorizontalIcon, XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { Portal } from "@stealthscale/component-primitives";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as FloatingPanel from "#floating-panel/index.ts";

const FIRST = { height: 200, width: 320 };

export function Controlled(): ReactElement {
  const { t } = useWords("floating-panel");
  const [open, setOpen] = useState(false);
  const [place, setPlace] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState(FIRST);

  return (
    <Stack align="flex-start" gap="sm">
      <FloatingPanel.Root
        onOpenChange={(details) => {
          setOpen(details.open);
        }}
        onPositionChange={(details) => {
          setPlace(details.position);
        }}
        onSizeChange={(details) => {
          setSize(details.size);
        }}
        open={open}
        size={size}
      >
        <FloatingPanel.Trigger as={Button}>{t("controlled.trigger")}</FloatingPanel.Trigger>
        <Portal>
          <FloatingPanel.Positioner>
            <FloatingPanel.Content>
              <FloatingPanel.Header>
                <FloatingPanel.DragTrigger>
                  <GripHorizontalIcon aria-hidden />
                  <FloatingPanel.Title>{t("controlled.heading")}</FloatingPanel.Title>
                </FloatingPanel.DragTrigger>
                <FloatingPanel.Control>
                  <FloatingPanel.CloseTrigger label={t("close")}>
                    <XIcon />
                  </FloatingPanel.CloseTrigger>
                </FloatingPanel.Control>
              </FloatingPanel.Header>
              <FloatingPanel.Body>
                <Stack align="flex-start" gap="sm">
                  <Text size="sm">{t("controlled.body")}</Text>
                  <Button
                    onClick={() => {
                      setSize(FIRST);
                    }}
                    size="sm"
                    variant="outline"
                  >
                    {t("controlled.reset")}
                  </Button>
                </Stack>
              </FloatingPanel.Body>
              <FloatingPanel.ResizeTriggers />
            </FloatingPanel.Content>
          </FloatingPanel.Positioner>
        </Portal>
      </FloatingPanel.Root>
      <Text as="output" size="sm" tone="muted">
        {open
          ? t("controlled.place", { ...size, x: Math.round(place.x), y: Math.round(place.y) })
          : null}
      </Text>
    </Stack>
  );
}
