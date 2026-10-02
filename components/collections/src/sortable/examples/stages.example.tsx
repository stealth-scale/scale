import { type ReactElement, useState } from "react";

import { GripVerticalIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Sortable from "#sortable/index.ts";

const STAGES = ["draft", "review", "legal", "publish", "archive"] as const;

export function Stages(): ReactElement {
  const { t } = useWords("sortable");
  const [stages, setStages] = useState(STAGES.map((id) => ({ id })));

  return (
    <Sortable.Root items={stages} onItemsChange={setStages}>
      <Sortable.Items aria-label={t("stages.label")}>
        {stages.map((stage, index) => (
          <Sortable.Item
            disabled={stage.id === "archive"}
            index={index}
            key={stage.id}
            label={t(`stages.${stage.id}`)}
            value={stage.id}
          >
            <Sortable.Handle>
              <GripVerticalIcon />
            </Sortable.Handle>
            {t(`stages.${stage.id}`)}
          </Sortable.Item>
        ))}
      </Sortable.Items>
    </Sortable.Root>
  );
}
