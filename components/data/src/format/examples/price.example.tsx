import { type ReactElement } from "react";

import * as Format from "#format/index.ts";

export function Price(props: Omit<Format.NumberProps, "value">): ReactElement {
  return (
    <Format.Number
      options={{ currency: "EUR", style: "currency" }}
      value={1_056_430.5}
      {...props}
    />
  );
}
