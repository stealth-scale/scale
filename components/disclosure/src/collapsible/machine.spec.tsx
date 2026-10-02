import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  ApiProvider,
  type CollapsibleOptions,
  splitCollapsibleProps,
  useCollapsible,
  useCollapsibleMachine,
} from "#collapsible/machine.ts";

/**
 * Runs the machine and renders its state through a part that reads the context.
 *
 * @param props - The machine's options.
 * @returns The state as text.
 */
function Running(props: CollapsibleOptions): ReactElement {
  const api = useCollapsibleMachine(props);

  return (
    <ApiProvider value={api}>
      <Reader />
    </ApiProvider>
  );
}

/**
 * Renders the open state the context reports.
 *
 * @returns A `span` with `open` or `closed`.
 */
function Reader(): ReactElement {
  const api = useCollapsible();

  return <span data-testid="state">{api.open ? "open" : "closed"}</span>;
}

describe("splitCollapsibleProps", () => {
  it("returns the machine's options first", () => {
    const [options] = splitCollapsibleProps({ defaultOpen: true, disabled: true });

    expect(options).toStrictEqual({ defaultOpen: true, disabled: true });
  });

  it("returns the element's props second", () => {
    const [, rest] = splitCollapsibleProps({ defaultOpen: true, size: "lg" });

    expect(rest).toStrictEqual({ size: "lg" });
  });

  it("splits by the machine's own key list", () => {
    const [options, rest] = splitCollapsibleProps({ className: "mine", collapsedHeight: 24 });

    expect(options).toStrictEqual({ collapsedHeight: 24 });
    expect(rest).toStrictEqual({ className: "mine" });
  });
});

describe("useCollapsibleMachine", () => {
  it("provides a running machine to a part", () => {
    render(<Running defaultOpen />);

    expect(screen.getByTestId("state").textContent).toBe("open");
  });

  it("starts closed", () => {
    render(<Running />);

    expect(screen.getByTestId("state").textContent).toBe("closed");
  });
});
