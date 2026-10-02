import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";

import { useListCollection } from "@stealthscale/component-collections";
import { useWords } from "@stealthscale/specimen";

import * as Select from "#select/index.ts";

interface Team {
  readonly id: string;
  readonly name: string;
}

const TEAMS = ["design", "engineering", "finance", "legal", "sales", "support"] as const;

export function Teams(): ReactElement {
  const { t } = useWords("select");
  const { collection } = useListCollection<Team>({
    itemToString: (team) => team.name,
    itemToValue: (team) => team.id,
    rows: TEAMS.map((id) => ({ id, name: t(`teams.${id}`) })),
  });

  return (
    <Select.Root collection={collection} defaultValue={["design", "finance"]} multiple>
      <Select.Label>{t("teams.label")}</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={t("teams.placeholder")}>
            {(items) => t("teams.count", { count: items.length })}
          </Select.ValueText>
        </Select.Trigger>
        <Select.ClearTrigger label={t("teams.clear")}>
          <XIcon />
        </Select.ClearTrigger>
        <Select.Indicator>
          <ChevronDownIcon />
        </Select.Indicator>
      </Select.Control>
      {createPortal(
        <Select.Positioner>
          <Select.Content>
            {collection.items.map((team) => (
              <Select.Item item={team} key={team.id}>
                <Select.ItemText item={team}>{team.name}</Select.ItemText>
                <Select.ItemIndicator item={team}>
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>,
        document.body,
      )}
    </Select.Root>
  );
}
