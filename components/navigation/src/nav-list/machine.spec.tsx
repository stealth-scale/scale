import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  type BranchOptions,
  BranchProvider,
  splitBranchProps,
  useBranch,
  useBranchMachine,
} from "#nav-list/machine.ts";

/**
 * Starts the machine and provides its api to a reader.
 *
 * @param props - The settings the machine starts with.
 * @returns The provider, holding the reader.
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
 * Renders the open state read through `useBranch`.
 *
 * @returns A span holding `open` or `closed`.
 */
function Reader(): ReactElement {
  const api = useBranch();

  return <span data-testid="state">{api.open ? "open" : "closed"}</span>;
}

describe("splitBranchProps", () => {
  it("returns the machine settings as the first element", () => {
    const [options] = splitBranchProps({ defaultOpen: true, disabled: true });

    expect(options).toStrictEqual({ defaultOpen: true, disabled: true });
  });

  it("returns the element props as the second element", () => {
    const [, rest] = splitBranchProps({ className: "mine", defaultOpen: true });

    expect(rest).toStrictEqual({ className: "mine" });
  });
});

describe("useBranchMachine", () => {
  it("returns an open api when defaultOpen is true", () => {
    render(<Running defaultOpen />);

    expect(screen.getByTestId("state").textContent).toBe("open");
  });

  it("returns a closed api when defaultOpen is absent", () => {
    render(<Running />);

    expect(screen.getByTestId("state").textContent).toBe("closed");
  });
});

describe("useBranch", () => {
  it("throws when no branch is mounted above the caller", () => {
    expect(() => render(<Reader />)).toThrow(/NavList\.Branch/u);
  });
});
