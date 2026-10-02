import { type ReactElement, useState } from "react";

import { GripVerticalIcon } from "lucide-react";

import { Badge } from "@stealthscale/component-data";
import { Code, Span } from "@stealthscale/component-typography";
import { useWords } from "@stealthscale/specimen";

import * as Sortable from "#sortable/index.ts";

const ISSUES = [
  { id: "SCL-118", priority: "high" },
  { id: "SCL-124", priority: "medium" },
  { id: "SCL-131", priority: "low" },
  { id: "SCL-137", priority: "medium" },
] as const;

const PALETTES = { high: "error", low: "neutral", medium: "warning" } as const;

export function Issues(): ReactElement {
  const { t } = useWords("sortable");
  const [issues, setIssues] = useState<Array<(typeof ISSUES)[number]>>([...ISSUES]);

  return (
    <Sortable.Root items={issues} onItemsChange={setIssues}>
      <Sortable.Items aria-label={t("issues.label")}>
        {issues.map((issue, index) => (
          <Sortable.Item
            index={index}
            key={issue.id}
            label={`${issue.id}, ${t(`issues.titles.${issue.id}`)}`}
            value={issue.id}
          >
            <Sortable.Handle>
              <GripVerticalIcon />
            </Sortable.Handle>
            <Sortable.ItemContent>
              <Code>{issue.id}</Code>
              <Span>{t(`issues.titles.${issue.id}`)}</Span>
            </Sortable.ItemContent>
            <Badge palette={PALETTES[issue.priority]}>{t(`issues.${issue.priority}`)}</Badge>
          </Sortable.Item>
        ))}
      </Sortable.Items>
    </Sortable.Root>
  );
}
