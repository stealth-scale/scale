import { type ReactElement } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { createLabelling } from "#create-labelling.ts";

const [LabellingProvider, useLabelled] = createLabelling("Probe");

/**
 * Reports a label through the hook under test.
 *
 * @returns Nothing visible.
 */
function Reporting(): ReactElement {
  useLabelled();

  return <span />;
}

describe("createLabelling", () => {
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

  it("throws with the component's name for a label outside its root", () => {
    expect(() => render(<Reporting />)).toThrow(
      "A part of Probe was drawn outside the root that holds it together.",
    );
  });
});
