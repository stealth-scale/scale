import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LabellingProvider, useLabelled } from "#pin-input/state.ts";

/**
 * Reports a label through the hook under test.
 *
 * @returns Nothing visible.
 */
function Reporting(): ReactElement {
  useLabelled();

  return <span />;
}

describe("state", () => {
  it("reports a label while it is mounted", () => {
    const setLabelled = vi.fn<(labelled: boolean) => void>();

    render(
      <LabellingProvider value={setLabelled}>
        <Reporting />
      </LabellingProvider>,
    );

    expect(setLabelled).toHaveBeenLastCalledWith(true);
  });

  it("withdraws a label when it unmounts", () => {
    const setLabelled = vi.fn<(labelled: boolean) => void>();
    const { unmount } = render(
      <LabellingProvider value={setLabelled}>
        <Reporting />
      </LabellingProvider>,
    );

    unmount();

    expect(setLabelled).toHaveBeenLastCalledWith(false);
  });

  it("throws for a label rendered outside a root", () => {
    expect(() => render(<Reporting />)).toThrow(
      "A part of PinInput was drawn outside the root that holds it together.",
    );
  });
});
