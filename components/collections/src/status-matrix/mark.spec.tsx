import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotElement } from "@stealthscale/testing-theme";

import { Mark } from "#status-matrix/mark.tsx";
import { type MatrixState } from "#status-matrix/states.ts";
import { framed } from "#status-matrix/status-matrix.fixtures.tsx";

/**
 * A state with a mark.
 */
const DRAWN: MatrixState = { label: "Healthy", mark: <svg />, tone: "success" };

/**
 * A state without a mark.
 */
const BARE: MatrixState = { label: "Not measured", tone: "neutral" };

describe("Mark", () => {
  it("renders the state's mark", () => {
    const { container } = render(framed(<Mark state={DRAWN} />));

    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("sets data-tone to the state's tone", () => {
    const { container } = render(framed(<Mark state={DRAWN} />));

    expect(slotElement(container, "status-matrix", "mark").dataset["tone"]).toBe("success");
  });

  it("renders the dot for a state without a mark", () => {
    const { container } = render(framed(<Mark state={BARE} />));

    expect(container.querySelector(`.${slotClass("status-matrix", "dot")}`)).toBeTruthy();
  });

  it("renders the label visually hidden", () => {
    const { container } = render(framed(<Mark label="ledger in EU: Healthy" state={DRAWN} />));

    expect(slotElement(container, "status-matrix", "name").textContent).toBe(
      "ledger in EU: Healthy",
    );
  });

  it("renders no label without the prop", () => {
    const { container } = render(framed(<Mark state={DRAWN} />));

    expect(container.querySelector(`.${slotClass("status-matrix", "name")}`)).toBeNull();
  });
});
