import { type ReactElement } from "react";

import { GripHorizontalIcon, XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Group } from "@stealthscale/component-layout";
import { Portal } from "@stealthscale/component-primitives";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as FloatingPanel from "#floating-panel/index.ts";

const PANELS = ["layers", "history"] as const;

function placed(
  step: number,
): (details: FloatingPanel.AnchorPositionDetails) => FloatingPanel.Point {
  return ({ boundaryRect }) => ({
    x: (boundaryRect?.width ?? 0) / 2 - 144 + step * 32,
    y: (boundaryRect?.height ?? 0) / 2 - 112 + step * 32,
  });
}

export function Stacked(): ReactElement {
  const { t } = useWords("floating-panel");

  return (
    <Group gap="sm">
      {PANELS.map((name, step) => (
        <FloatingPanel.Root
          defaultSize={{ height: 192, width: 256 }}
          getAnchorPosition={placed(step)}
          key={name}
        >
          <FloatingPanel.Trigger as={Button}>{t(`stacked.${name}.trigger`)}</FloatingPanel.Trigger>
          <Portal>
            <FloatingPanel.Positioner>
              <FloatingPanel.Content>
                <FloatingPanel.Header>
                  <FloatingPanel.DragTrigger>
                    <GripHorizontalIcon aria-hidden />
                    <FloatingPanel.Title>{t(`stacked.${name}.heading`)}</FloatingPanel.Title>
                  </FloatingPanel.DragTrigger>
                  <FloatingPanel.Control>
                    <FloatingPanel.CloseTrigger label={t("close")}>
                      <XIcon />
                    </FloatingPanel.CloseTrigger>
                  </FloatingPanel.Control>
                </FloatingPanel.Header>
                <FloatingPanel.Body>
                  <Text size="sm">{t(`stacked.${name}.body`)}</Text>
                </FloatingPanel.Body>
                <FloatingPanel.ResizeTriggers />
              </FloatingPanel.Content>
            </FloatingPanel.Positioner>
          </Portal>
        </FloatingPanel.Root>
      ))}
    </Group>
  );
}
