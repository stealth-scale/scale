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
 * Runs the machine and reports what it answers, so a case can read its state off the screen.
 *
 * @param props - The settings the machine is started with.
 * @returns The state, drawn as text.
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
 * Reads the running machine through the hook a part reads it through.
 *
 * @returns The headings on screen, and how many are listed.
 */
function Reader(): ReactElement {
  const api = useToc();

  return (
    <span data-testid="state">{`${api.activeIds.join(",") || "none"} of ${String(api.items.length)}`}</span>
  );
}

describe("splitTocProps", () => {
  it("takes the machine's settings out of what the root was handed", () => {
    const [options] = splitTocProps({ autoScroll: false, items: [...ITEMS] });

    expect(options).toStrictEqual({ autoScroll: false, items: [...ITEMS] });
  });

  it("leaves everything the element takes behind", () => {
    const [, rest] = splitTocProps({ items: [...ITEMS], size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });
});

describe("useTocMachine", () => {
  it("answers a running machine a part can read", async () => {
    await drawn(<Running defaultActiveIds={["sizes"]} items={[...ITEMS]} />);

    expect(screen.getByTestId("state").textContent).toBe("sizes of 3");
  });

  it("marks no heading where a caller says nothing", async () => {
    await drawn(<Running items={[...ITEMS]} />);

    expect(screen.getByTestId("state").textContent).toBe("none of 3");
  });

  it("keeps the machine's own default where a caller hands over nothing for it", async () => {
    await drawn(<Running defaultActiveIds={undefined} items={[...ITEMS]} />);

    expect(screen.getByTestId("state").textContent).toBe("none of 3");
  });
});
