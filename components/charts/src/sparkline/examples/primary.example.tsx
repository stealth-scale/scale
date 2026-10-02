import { type ReactElement } from "react";

import { Sparkline } from "#sparkline/index.ts";

const WEEK = [12, 18, 15, 21, 22, 30, 27];

export function Primary(props: Omit<Parameters<typeof Sparkline>[0], "values">): ReactElement {
  return <Sparkline values={WEEK} {...props} />;
}
