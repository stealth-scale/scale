import { type ReactElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { counted, useInputState } from "#toggled.ts";

/**
 * Describes the state the probe writes into its input.
 */
interface Stated {
  /**
   * Whether the input is on.
   */
  readonly checked: boolean;

  /**
   * Whether the input is partly on.
   */
  readonly indeterminate: boolean;

  /**
   * Count of presses.
   */
  readonly presses: number;
}

/**
 * Renders an input that takes the state through the hook.
 */
function Probe({ checked, indeterminate, presses }: Stated): ReactElement {
  const input = useInputState(checked, indeterminate, presses);

  return <input aria-label="Probe" ref={input} type="checkbox" />;
}

/**
 * Returns the probe's input.
 */
function probed(): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("checkbox", { name: "Probe" });
}

describe("toggled", () => {
  it("returns the count of presses plus one", () => {
    expect(counted(2)).toBe(3);
  });

  it("writes checked into the input", () => {
    render(<Probe checked indeterminate={false} presses={0} />);

    expect(probed().checked).toBe(true);
  });

  it("writes indeterminate into the input", () => {
    render(<Probe checked={false} indeterminate presses={0} />);

    expect(probed().indeterminate).toBe(true);
  });

  it("writes the state again when presses changes and the state does not", () => {
    const { rerender } = render(<Probe checked={false} indeterminate={false} presses={0} />);

    probed().checked = true;
    rerender(<Probe checked={false} indeterminate={false} presses={1} />);

    expect(probed().checked).toBe(false);
  });
});
