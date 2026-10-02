import { type ReactElement } from "react";

import { useWords } from "@stealthscale/specimen";

import * as Timeline from "#timeline/index.ts";

const EVENTS = ["raised", "accepted", "settled"] as const;

export function Run(props: Timeline.RootProps): ReactElement {
  const { t } = useWords("timeline");

  return (
    <Timeline.Root {...props}>
      {EVENTS.map((event, index) => (
        <Timeline.Item key={event}>
          <Timeline.Connector>
            <Timeline.Indicator>{index + 1}</Timeline.Indicator>
          </Timeline.Connector>
          <Timeline.Content>
            <Timeline.Title>{t(event)}</Timeline.Title>
            <Timeline.Description>{t(`${event}On`)}</Timeline.Description>
          </Timeline.Content>
        </Timeline.Item>
      ))}
    </Timeline.Root>
  );
}
