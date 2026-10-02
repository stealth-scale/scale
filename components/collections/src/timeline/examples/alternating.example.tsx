import { type ReactElement } from "react";

import { HouseIcon, PackageIcon, ShoppingCartIcon, TruckIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Timeline from "#timeline/index.ts";

const LEGS = [
  ["placed", "end", ShoppingCartIcon],
  ["packed", "start", PackageIcon],
  ["shipped", "end", TruckIcon],
  ["arrived", "start", HouseIcon],
] as const;

export function Alternating(): ReactElement {
  const { t } = useWords("timeline");

  return (
    <Timeline.Root rail="center" variant="outline">
      {LEGS.map(([leg, side, Glyph]) => {
        const words = (
          <Timeline.Content>
            <Timeline.Title>{t(leg)}</Timeline.Title>
            <Timeline.Description>{t(`${leg}At`)}</Timeline.Description>
          </Timeline.Content>
        );

        return (
          <Timeline.Item key={leg}>
            {side === "start" ? words : null}
            <Timeline.Connector>
              <Timeline.Indicator>
                <Glyph />
              </Timeline.Indicator>
            </Timeline.Connector>
            {side === "end" ? words : null}
          </Timeline.Item>
        );
      })}
    </Timeline.Root>
  );
}
