import { type ReactElement } from "react";

import { GripHorizontalIcon, XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { DataList } from "@stealthscale/component-collections";
import { Portal } from "@stealthscale/component-primitives";
import { useWords } from "@stealthscale/specimen";

import * as FloatingPanel from "#floating-panel/index.ts";

const SHORTCUTS = ["bold", "italic", "link", "undo"] as const;

export function Snapped(): ReactElement {
  const { t } = useWords("floating-panel");

  return (
    <FloatingPanel.Root
      allowOverflow={false}
      defaultSize={{ height: 224, width: 272 }}
      gridSize={16}
      maxSize={{ height: 480, width: 480 }}
      minSize={{ height: 160, width: 256 }}
    >
      <FloatingPanel.Trigger as={Button}>{t("snapped.trigger")}</FloatingPanel.Trigger>
      <Portal>
        <FloatingPanel.Positioner>
          <FloatingPanel.Content>
            <FloatingPanel.Header>
              <FloatingPanel.DragTrigger>
                <GripHorizontalIcon aria-hidden />
                <FloatingPanel.Title>{t("snapped.heading")}</FloatingPanel.Title>
              </FloatingPanel.DragTrigger>
              <FloatingPanel.Control>
                <FloatingPanel.CloseTrigger label={t("close")}>
                  <XIcon />
                </FloatingPanel.CloseTrigger>
              </FloatingPanel.Control>
            </FloatingPanel.Header>
            <FloatingPanel.Body>
              <DataList.Root orientation="horizontal" size="sm">
                {SHORTCUTS.map((shortcut) => (
                  <DataList.Item key={shortcut}>
                    <DataList.ItemLabel>
                      {t(`snapped.shortcuts.${shortcut}.label`)}
                    </DataList.ItemLabel>
                    <DataList.ItemValue>
                      {t(`snapped.shortcuts.${shortcut}.keys`)}
                    </DataList.ItemValue>
                  </DataList.Item>
                ))}
              </DataList.Root>
            </FloatingPanel.Body>
            <FloatingPanel.ResizeTriggers />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel.Root>
  );
}
