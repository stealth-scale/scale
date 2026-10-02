import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Timeline from "#timeline/index.ts";

const LEGS = ["booked", "cleared", "delivered"] as const;

export function Dated(props: Timeline.RootProps): ReactElement {
  const { t } = useWords("timeline");

  return (
    <Timeline.Root variant="subtle" {...props}>
      {LEGS.map((leg, index) => (
        <Timeline.Item key={leg}>
          <Timeline.Content>
            <Timeline.Title>{t(`${leg}On`)}</Timeline.Title>
          </Timeline.Content>
          <Timeline.Connector>
            <Timeline.Indicator>{index + 1}</Timeline.Indicator>
          </Timeline.Connector>
          <Timeline.Content>
            <Timeline.Title>{t(leg)}</Timeline.Title>
          </Timeline.Content>
        </Timeline.Item>
      ))}
    </Timeline.Root>
  );
}
