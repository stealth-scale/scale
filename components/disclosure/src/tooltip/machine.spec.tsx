import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  ApiProvider,
  splitTooltipProps,
  type TooltipOptions,
  useTooltip,
  useTooltipMachine,
} from "#tooltip/machine.ts";

/**
 * Runs the machine and renders its state through a part that reads the context.
 *
 * @param props - The machine's options.
 * @returns The state as text.
 */
function Running(props: TooltipOptions): ReactElement {
  const api = useTooltipMachine(props);

  return (
    <ApiProvider value={api}>
      <Reader />
    </ApiProvider>
  );
}

/**
 * Renders the open state the context reports.
 *
 * @returns A `span` with `open` or `shut`.
 */
function Reader(): ReactElement {
  const api = useTooltip();

  return <span data-testid="state">{api.open ? "open" : "shut"}</span>;
}

describe("splitTooltipProps", () => {
  it("returns the machine's options first", () => {
    const [options] = splitTooltipProps({ closeDelay: 0, openDelay: 0 });

    expect(options).toStrictEqual({ closeDelay: 0, openDelay: 0 });
  });

  it("returns the element's props second", () => {
    const [, rest] = splitTooltipProps({ openDelay: 0, size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });
});

describe("useTooltipMachine", () => {
  it("provides a running machine to a part", async () => {
    await drawn(<Running defaultOpen />);

    expect(screen.getByTestId("state").textContent).toBe("open");
  });

  it("starts closed", async () => {
    await drawn(<Running />);

    expect(screen.getByTestId("state").textContent).toBe("shut");
  });

  it("keeps the machine's default for an undefined option", async () => {
    await drawn(<Running defaultOpen openDelay={undefined} />);

    expect(screen.getByTestId("state").textContent).toBe("open");
  });
});
