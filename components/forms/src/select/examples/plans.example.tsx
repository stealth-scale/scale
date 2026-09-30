import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import {
  BuildingIcon,
  CheckIcon,
  ChevronDownIcon,
  type LucideIcon,
  SproutIcon,
  UsersIcon,
} from "lucide-react";

import { useListCollection } from "@stealthscale/component-collections";
import { useWords } from "@stealthscale/specimen";

import * as Select from "#select/index.ts";

interface Plan {
  readonly Icon: LucideIcon;
  readonly id: string;
  readonly name: string;
  readonly price: string;
}

const PLANS = [
  { Icon: SproutIcon, id: "starter" },
  { Icon: UsersIcon, id: "team" },
  { Icon: BuildingIcon, id: "business" },
] as const;

export function Plans(): ReactElement {
  const { t } = useWords("select");
  const { collection } = useListCollection<Plan>({
    itemToString: (plan) => plan.name,
    itemToValue: (plan) => plan.id,
    rows: PLANS.map(({ Icon, id }) => ({
      Icon,
      id,
      name: t(`plans.${id}.name`),
      price: t(`plans.${id}.price`),
    })),
  });

  return (
    <Select.Root collection={collection} defaultValue={["team"]}>
      <Select.Label>{t("plans.label")}</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={t("plans.placeholder")} />
        </Select.Trigger>
        <Select.Indicator>
          <ChevronDownIcon />
        </Select.Indicator>
      </Select.Control>
      {createPortal(
        <Select.Positioner>
          <Select.Content>
            {collection.items.map((plan) => (
              <Select.Item item={plan} key={plan.id}>
                <plan.Icon />
                <Select.ItemLines>
                  <Select.ItemText item={plan}>{plan.name}</Select.ItemText>
                  <Select.ItemDescription>{plan.price}</Select.ItemDescription>
                </Select.ItemLines>
                <Select.ItemIndicator item={plan}>
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
