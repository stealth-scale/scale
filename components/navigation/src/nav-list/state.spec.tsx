import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  type BranchOptions,
  BranchProvider,
  splitBranchProps,
  useBranch,
  useBranchMachine,
} from "#nav-list/state.ts";

/**
 * Runs the machine and reports what it answers, so a case can read its state off the screen.
 *
 * @param props - The settings the machine is started with.
 * @returns The state, drawn as text.
 */
function Running(props: BranchOptions): ReactElement {
  const api = useBranchMachine(props);

  return (
    <BranchProvider value={api}>
      <Reader />
    </BranchProvider>
  );
}

/**
 * Reads the running machine through the hook a part reads it through.
 *
 * @returns Whether the list is open.
 */
function Reader(): ReactElement {
  const api = useBranch();

  return <span data-testid="state">{api.open ? "open" : "closed"}</span>;
}

describe("splitBranchProps", () => {
  it("takes the machine's settings out of what the branch was handed", () => {
    const [options] = splitBranchProps({ defaultOpen: true, disabled: true });

    expect(options).toStrictEqual({ defaultOpen: true, disabled: true });
  });

  it("leaves everything the element takes behind", () => {
    const [, rest] = splitBranchProps({ className: "mine", defaultOpen: true });

    expect(rest).toStrictEqual({ className: "mine" });
  });
});

describe("useBranchMachine", () => {
  it("answers a running machine a part can read", () => {
    render(<Running defaultOpen />);

    expect(screen.getByTestId("state").textContent).toBe("open");
  });

  it("starts closed where a caller says nothing", () => {
    render(<Running />);

    expect(screen.getByTestId("state").textContent).toBe("closed");
  });
});

describe("useBranch", () => {
  it("throws where no branch stands above the reader", () => {
    expect(() => render(<Reader />)).toThrow(/NavList\.Branch/u);
  });
});
