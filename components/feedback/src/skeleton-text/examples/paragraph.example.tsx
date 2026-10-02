import { type ReactElement } from "react";

import { SkeletonText } from "#skeleton-text/index.ts";

export function Paragraph(props: Parameters<typeof SkeletonText>[0]): ReactElement {
  return <SkeletonText {...props} />;
}
