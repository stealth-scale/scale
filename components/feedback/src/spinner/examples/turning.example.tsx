import { type ReactElement } from "react";

import { Spinner } from "#spinner/index.ts";

export function Turning(props: Parameters<typeof Spinner>[0]): ReactElement {
  return <Spinner {...props} />;
}
