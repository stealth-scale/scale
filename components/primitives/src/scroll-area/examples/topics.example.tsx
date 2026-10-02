import { type ReactElement } from "react";

import { ToggleGroup } from "@stealthscale/component-actions";
import { useWords } from "@stealthscale/specimen";

import * as ScrollArea from "#scroll-area/index.ts";

const TOPICS = [
  "all",
  "design",
  "engineering",
  "product",
  "marketing",
  "sales",
  "support",
  "finance",
  "legal",
  "people",
  "security",
  "research",
  "operations",
];

export function Topics(props: ScrollArea.RootProps): ReactElement {
  const { t } = useWords("scroll-area");

  return (
    <ScrollArea.Root fade inset="xs" scrolls="horizontal" {...props}>
      <ScrollArea.Viewport aria-label={t("topics.label")}>
        <ScrollArea.Content>
          <ToggleGroup.Root
            aria-label={t("topics.filter")}
            attached={false}
            defaultValue={["all"]}
            deselectable={false}
            gap="xs"
            size="sm"
            variant="outline"
          >
            {TOPICS.map((topic) => (
              <ToggleGroup.Item key={topic} value={topic}>
                {t(`topics.names.${topic}`)}
              </ToggleGroup.Item>
            ))}
          </ToggleGroup.Root>
        </ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="horizontal" />
    </ScrollArea.Root>
  );
}
