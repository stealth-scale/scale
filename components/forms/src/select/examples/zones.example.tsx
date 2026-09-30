import { type ReactElement } from "react";
import { createPortal } from "react-dom";

import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { useListCollection } from "@stealthscale/component-collections";
import { useWords } from "@stealthscale/specimen";

import * as Select from "#select/index.ts";

interface Zone {
  readonly id: string;
  readonly name: string;
  readonly region: string;
}

const REGIONS = {
  americas: ["new-york", "chicago", "sao-paulo"],
  asia: ["tokyo", "singapore"],
  europe: ["amsterdam", "london", "lisbon"],
} as const;

const ORDER = ["europe", "americas", "asia"] as const;

export function Zones(): ReactElement {
  const { t } = useWords("select");
  const { collection } = useListCollection<Zone>({
    itemToString: (zone) => zone.name,
    itemToValue: (zone) => zone.id,
    rows: ORDER.flatMap((region) =>
      REGIONS[region].map((id) => ({ id, name: t(`zones.${id}`), region })),
    ),
  });

  return (
    <Select.Root collection={collection} defaultValue={["amsterdam"]}>
      <Select.Label>{t("zones.label")}</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={t("zones.placeholder")} />
        </Select.Trigger>
        <Select.Indicator>
          <ChevronDownIcon />
        </Select.Indicator>
      </Select.Control>
      {createPortal(
        <Select.Positioner>
          <Select.Content>
            {ORDER.map((region) => (
              <Select.ItemGroup id={region} key={region}>
                <Select.ItemGroupLabel htmlFor={region}>
                  {t(`zones.${region}`)}
                </Select.ItemGroupLabel>
                {collection.items
                  .filter((zone) => zone.region === region)
                  .map((zone) => (
                    <Select.Item item={zone} key={zone.id}>
                      <Select.ItemText item={zone}>{zone.name}</Select.ItemText>
                      <Select.ItemIndicator item={zone}>
                        <CheckIcon />
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
              </Select.ItemGroup>
            ))}
          </Select.Content>
        </Select.Positioner>,
        document.body,
      )}
    </Select.Root>
  );
}
