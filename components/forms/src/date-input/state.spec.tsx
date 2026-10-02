import { type ReactElement } from "react";

import { render, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LabellingProvider, namesOf, useLabelled, useShared } from "#date-input/state.ts";
import { namesOf as shared } from "#naming.ts";

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
  it("throws with the date input's name for a part outside a root", () => {
    expect(() => renderHook(() => useShared())).toThrow(
      "A part of DateInput was drawn outside the root that holds it together.",
    );
  });

  it("reports a label while it is mounted", () => {
    const setLabelled = vi.fn<(labelled: boolean) => void>();

    render(
      <LabellingProvider value={setLabelled}>
        <Reporting />
      </LabellingProvider>,
    );

    expect(setLabelled).toHaveBeenLastCalledWith(true);
  });

  it("throws for a label rendered outside a root", () => {
    expect(() => render(<Reporting />)).toThrow(
      "A part of DateInput was drawn outside the root that holds it together.",
    );
  });

  it("shares the names through the forms package's namesOf", () => {
    expect(namesOf).toBe(shared);
  });
});
