import { type ReactElement, useState } from "react";

import { RotateCcwIcon } from "lucide-react";

import { Button } from "@stealthscale/component-actions";
import { Stack } from "@stealthscale/component-layout";
import { ScrollArea } from "@stealthscale/component-primitives";
import { Text } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Splitter from "#splitter/index.ts";

const FIRST: Splitter.PanelSize[] = [50, 50];

export function Controlled(): ReactElement {
  const { t } = useWords("splitter");
  const [size, setSize] = useState(FIRST);
  const reset = (): void => {
    setSize(FIRST);
  };
  const splitter = Splitter.useSplitter({
    onResize: (details) => {
      setSize(details.size);
    },
    panels: [
      { id: "chart", minSize: 20 },
      { id: "table", minSize: 20 },
    ],
    size,
  });
  const [chart = 0, table = 0] = splitter.getSizes();

  return (
    <Splitter.Root splitter={splitter}>
      <Splitter.Panel id="chart">
        <ScrollArea.Root inset="md">
          <ScrollArea.Viewport aria-label={t("controlled.chart")}>
            <ScrollArea.Content>
              <Stack align="flex-start" gap="sm">
                <Text as="output">
                  {t("controlled.sizes", { chart: Math.round(chart), table: Math.round(table) })}
                </Text>
                <Button onClick={reset} size="sm" variant="outline">
                  <RotateCcwIcon />
                  {t("controlled.reset")}
                </Button>
              </Stack>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>
      </Splitter.Panel>
      <Splitter.ResizeTrigger
        id="chart:table"
        label={t("controlled.resize")}
        onDoubleClick={reset}
      />
      <Splitter.Panel id="table">
        <ScrollArea.Root inset="md">
          <ScrollArea.Viewport aria-label={t("controlled.table")}>
            <ScrollArea.Content>
              <Text size="sm" tone="muted">
                {t("controlled.hint")}
              </Text>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar />
        </ScrollArea.Root>
      </Splitter.Panel>
    </Splitter.Root>
  );
}
