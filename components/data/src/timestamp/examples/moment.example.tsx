import { type ReactElement } from "react";

import { Timestamp, type TimestampProps } from "#timestamp/index.ts";

const NOW = new Date("2026-07-25T14:30:00Z");

export function Moment(props: Omit<TimestampProps, "value">): ReactElement {
  return <Timestamp now={NOW} value="2026-07-25T12:15:00Z" {...props} />;
}
