import { type ReactElement } from "react";

import { CheckIcon, TruckIcon } from "lucide-react";

import { useWords } from "@stealthscale/specimen";

import * as Timeline from "#timeline/index.ts";

export function Shipment(): ReactElement {
  const { t } = useWords("timeline");

  return (
    <Timeline.Root ongoing palette="success">
      <Timeline.Item>
        <Timeline.Connector>
          <Timeline.Indicator>
            <CheckIcon />
          </Timeline.Indicator>
        </Timeline.Connector>
        <Timeline.Content>
          <Timeline.Title>{t("left")}</Timeline.Title>
          <Timeline.Description>{t("leftOn")}</Timeline.Description>
        </Timeline.Content>
      </Timeline.Item>
      <Timeline.Item>
        <Timeline.Connector>
          <Timeline.Indicator>
            <TruckIcon />
          </Timeline.Indicator>
        </Timeline.Connector>
        <Timeline.Content>
          <Timeline.Title>{t("transit")}</Timeline.Title>
          <Timeline.Description>{t("expected")}</Timeline.Description>
        </Timeline.Content>
      </Timeline.Item>
    </Timeline.Root>
  );
}
