import { type ReactElement, useState } from "react";

import { Switch } from "@stealthscale/component-forms";
import { Stack } from "@stealthscale/component-layout";
import { ScrollArea } from "@stealthscale/component-primitives";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Splitter from "#splitter/index.ts";

export function Locked(): ReactElement {
  const { t } = useWords("splitter");
  const [editing, setEditing] = useState(false);
  const splitter = Splitter.useSplitter({
    defaultSize: [60, 40],
    panels: [
      { id: "revenue", minSize: 30 },
      { id: "activity", minSize: 25 },
    ],
  });

  return (
    <Splitter.Root splitter={splitter}>
      <Splitter.Panel id="revenue">
        <ScrollArea.Root inset="md">
          <ScrollArea.Viewport aria-label={t("locked.revenue")}>
            <ScrollArea.Content>
              <Stack align="flex-start" gap="sm">
                <Text weight="semibold">{t("locked.revenue")}</Text>
                <Switch.Root
                  checked={editing}
                  onCheckedChange={(details) => {
                    setEditing(details.checked);
                  }}
                >
                  <Switch.Control>
                    <Switch.Thumb />
                  </Switch.Control>
                  <Switch.Label>{t("locked.edit")}</Switch.Label>
                </Switch.Root>
              </Stack>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>
      </Splitter.Panel>
      <Splitter.ResizeTrigger
        disabled={!editing}
        id="revenue:activity"
        label={t("locked.resize")}
      />
      <Splitter.Panel id="activity">
        <ScrollArea.Root inset="md">
          <ScrollArea.Viewport aria-label={t("locked.activity")}>
            <ScrollArea.Content>
              <Text size="sm" tone="muted">
                {t("locked.activityText")}
              </Text>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>
      </Splitter.Panel>
    </Splitter.Root>
  );
}
