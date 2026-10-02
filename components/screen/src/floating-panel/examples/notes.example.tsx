import { type ReactElement } from "react";

import { GripHorizontalIcon, Maximize2Icon, Minimize2Icon, MinusIcon, XIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Portal } from "@stealthscale/component-primitives";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as FloatingPanel from "#floating-panel/index.ts";

const STAGES = [
  { Icon: MinusIcon, stage: "minimized", word: "minimize" },
  { Icon: Maximize2Icon, stage: "maximized", word: "maximize" },
  { Icon: Minimize2Icon, stage: "default", word: "restore" },
] as const;

export function Notes(): ReactElement {
  const { t } = useWords("floating-panel");

  return (
    <FloatingPanel.Root>
      <FloatingPanel.Trigger as={Button}>{t("notes.trigger")}</FloatingPanel.Trigger>
      <Portal>
        <FloatingPanel.Positioner>
          <FloatingPanel.Content>
            <FloatingPanel.Header>
              <FloatingPanel.DragTrigger>
                <GripHorizontalIcon aria-hidden />
                <FloatingPanel.Title>{t("notes.heading")}</FloatingPanel.Title>
              </FloatingPanel.DragTrigger>
              <FloatingPanel.Control>
                {STAGES.map(({ Icon, stage, word }) => (
                  <FloatingPanel.StageTrigger key={stage} label={t(word)} stage={stage}>
                    <Icon />
                  </FloatingPanel.StageTrigger>
                ))}
                <FloatingPanel.CloseTrigger label={t("close")}>
                  <XIcon />
                </FloatingPanel.CloseTrigger>
              </FloatingPanel.Control>
            </FloatingPanel.Header>
            <FloatingPanel.Body>
              <Text size="sm">{t("notes.body")}</Text>
            </FloatingPanel.Body>
            <FloatingPanel.ResizeTriggers />
          </FloatingPanel.Content>
        </FloatingPanel.Positioner>
      </Portal>
    </FloatingPanel.Root>
  );
}
