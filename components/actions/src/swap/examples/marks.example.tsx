import { type ReactElement } from "react";

import { MoonIcon, SunIcon } from "lucide-react";

import * as Swap from "#swap/index.ts";

export function Marks(props: Swap.RootProps): ReactElement {
  return (
    <Swap.Root {...props}>
      <Swap.Indicator type="on">
        <MoonIcon aria-hidden size="1.5em" />
      </Swap.Indicator>
      <Swap.Indicator type="off">
        <SunIcon aria-hidden size="1.5em" />
      </Swap.Indicator>
    </Swap.Root>
  );
}
