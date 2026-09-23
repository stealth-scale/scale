import { type ReactElement } from "react";

import { ColorSwatch } from "#color-swatch/index.ts";

export function Primary(props: Omit<Parameters<typeof ColorSwatch>[0], "value">): ReactElement {
  return <ColorSwatch value="#D72323" {...props} />;
}
