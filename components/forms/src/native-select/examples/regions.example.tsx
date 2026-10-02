import { type ReactElement } from "react";

import { ChevronDownIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as NativeSelect from "#native-select/index.ts";

const REGIONS = [
  ["europe", ["amsterdam", "frankfurt", "dublin"]],
  ["americas", ["virginia", "saoPaulo"]],
  ["asia", ["singapore", "tokyo"]],
] as const;

export function Regions(): ReactElement {
  const { t } = useWords("native-select");

  return (
    <NativeSelect.Root>
      <NativeSelect.Field aria-label={t("region")} defaultValue="frankfurt">
        {REGIONS.map(([region, places]) => (
          <optgroup key={region} label={t(region)}>
            {places.map((place) => (
              <option key={place} value={place}>
                {t(place)}
              </option>
            ))}
          </optgroup>
        ))}
      </NativeSelect.Field>
      <NativeSelect.Indicator>
        <ChevronDownIcon />
      </NativeSelect.Indicator>
    </NativeSelect.Root>
  );
}
