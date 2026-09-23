import { type ReactElement } from "react";

import * as Kbd from "#kbd/index.ts";

export function Escape(props: Kbd.RootProps): ReactElement {
  return <Kbd.Root {...props}>Esc</Kbd.Root>;
}
