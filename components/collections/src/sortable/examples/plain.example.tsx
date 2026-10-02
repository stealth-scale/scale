import { type ReactElement, useState } from "react";

import { GripVerticalIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Sortable from "#sortable/index.ts";

const STAGES = ["draft", "review", "legal", "publish"] as const;

export function Plain(): ReactElement {
  const { t } = useWords("sortable");
  const [stages, setStages] = useState(STAGES.map((id) => ({ id })));

  return (
    <Sortable.Root items={stages} onItemsChange={setStages} variant="plain">
      <Sortable.Items aria-label={t("plain.label")}>
        {stages.map((stage, index) => (
          <Sortable.Item
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
