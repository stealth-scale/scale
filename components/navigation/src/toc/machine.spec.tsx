import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  ApiProvider,
  splitTocProps,
  type TocOptions,
  useToc,
  useTocMachine,
} from "#toc/machine.ts";
import { ITEMS } from "#toc/toc.fixtures.tsx";

/**
 * Runs the machine and provides its api to `Reader`.
 */
function Running(props: TocOptions): ReactElement {
  const api = useTocMachine(props);

  return (
    <ApiProvider value={api}>
      <Reader />
    </ApiProvider>
  );
}

/**
 * Renders the active IDs and the item count read through `useToc`.
 */
function Reader(): ReactElement {
  const api = useToc();

  return (
    <span data-testid="state">{`${api.activeIds.join(",") || "none"} of ${String(api.items.length)}`}</span>
  );
}

describe("machine", () => {
  it("returns the machine options first from splitTocProps", () => {
    const [options] = splitTocProps({ autoScroll: false, items: [...ITEMS] });

    expect(options).toStrictEqual({ autoScroll: false, items: [...ITEMS] });
  });

  it("returns the element props second from splitTocProps", () => {
    const [, rest] = splitTocProps({ items: [...ITEMS], size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });

  it("provides the running machine through useToc", async () => {
    await drawn(<Running defaultActiveIds={["sizes"]} items={[...ITEMS]} />);

    expect(screen.getByTestId("state").textContent).toBe("sizes of 3");
  });

  it("marks no heading active when defaultActiveIds is absent", async () => {
    await drawn(<Running items={[...ITEMS]} />);

    expect(screen.getByTestId("state").textContent).toBe("none of 3");
  });

  it("keeps the machine default when defaultActiveIds is undefined", async () => {
    await drawn(<Running defaultActiveIds={undefined} items={[...ITEMS]} />);

    expect(screen.getByTestId("state").textContent).toBe("none of 3");
  });
});
