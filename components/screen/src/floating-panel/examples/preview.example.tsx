import { type ReactElement } from "react";

import { GripHorizontalIcon, XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Group } from "@stealthscale/component-layout";
import { Avatar } from "@stealthscale/component-media";
import { Portal } from "@stealthscale/component-primitives";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as FloatingPanel from "#floating-panel/index.ts";

export function Preview(): ReactElement {
  const { t } = useWords("floating-panel");

  return (
    <FloatingPanel.Root
      defaultSize={{ height: 234, width: 320 }}
      lockAspectRatio
      maxSize={{ height: 468, width: 640 }}
      minSize={{ height: 176, width: 240 }}
    >
      <FloatingPanel.Trigger as={Button}>{t("preview.trigger")}</FloatingPanel.Trigger>
      <Portal>
        <FloatingPanel.Positioner>
          <FloatingPanel.Content>
            <FloatingPanel.Header>
              <FloatingPanel.DragTrigger>
                <GripHorizontalIcon aria-hidden />
                <FloatingPanel.Title>{t("preview.heading")}</FloatingPanel.Title>
              </FloatingPanel.DragTrigger>
              <FloatingPanel.Control>
                <FloatingPanel.CloseTrigger label={t("preview.leave")}>
                  <XIcon />
                </FloatingPanel.CloseTrigger>
              </FloatingPanel.Control>
            </FloatingPanel.Header>
            <FloatingPanel.Body>
              <Group align="baseline" gap="sm">
                <Avatar.Root name={t("preview.ada")} size="lg">
                  <Avatar.Fallback />
                </Avatar.Root>
                <Text size="sm" tone="muted">
                  {t("preview.speaking")}
                </Text>
              </Group>
            </FloatingPanel.Body>
            <FloatingPanel.ResizeTriggers />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel.Root>
  );
}
