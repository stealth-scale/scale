import { type ReactElement } from "react";

import { Sparkbar } from "#sparkbar/index.ts";

const WEEK = [6, 9, 4, 7, 11, 3, 8];

export function Primary(props: Omit<Parameters<typeof Sparkbar>[0], "values">): ReactElement {
  return <Sparkbar values={WEEK} {...props} />;
}
