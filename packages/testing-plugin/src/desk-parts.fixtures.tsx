import { type ReactElement } from "react";

import { HostRoot } from "@stealthscale/sdk-host";

export function BoardPage(): ReactElement {
  return <h1>Board</h1>;
}

export function Note(): ReactElement {
  return <span>note</span>;
}

export function Pin(): ReactElement {
  return <span>pin</span>;
}

export function Tag(): ReactElement {
  return <span>tag</span>;
}

export function ContentlessFrame(): ReactElement {
  return (
    <HostRoot>
      <p>No content</p>
    </HostRoot>
  );
}
