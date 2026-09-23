import { type ReactElement } from "react";

import { Code } from "#code/index.ts";

export function Install(props: Parameters<typeof Code>[0]): ReactElement {
  return <Code {...props}>pnpm add</Code>;
}
