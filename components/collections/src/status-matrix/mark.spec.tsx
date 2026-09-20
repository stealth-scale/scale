import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass, slotElement } from "@stealthscale/testing-theme";

import { Mark } from "#status-matrix/mark.tsx";
import { type MatrixState } from "#status-matrix/states.ts";
import { framed } from "#status-matrix/status-matrix.fixtures.tsx";

/**
 * A state drawn with a mark of its own.
 */
const DRAWN: MatrixState = { label: "Healthy", mark: <svg />, tone: "success" };

/**
 * A state left with no mark of its own.
 */
const BARE: MatrixState = { label: "Not measured", tone: "neutral" };

describe("Mark", () => {
  it("draws the mark a state states", () => {
    const { container } = render(framed(<Mark state={DRAWN} />));

    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("states the tone the mark is drawn in", () => {
    const { container } = render(framed(<Mark state={DRAWN} />));

    expect(slotElement(container, "status-matrix", "mark").dataset["tone"]).toBe("success");
  });

  it("draws a filled disc for a state with no mark of its own", () => {
    const { container } = render(framed(<Mark state={BARE} />));

    expect(container.querySelector(`.${slotClass("status-matrix", "dot")}`)).toBeTruthy();
  });

  it("reads the words out where a caller asks for them", () => {
    const { container } = render(framed(<Mark label="ledger in EU: Healthy" state={DRAWN} />));

    expect(slotElement(container, "status-matrix", "name").textContent).toBe(
      "ledger in EU: Healthy",
    );
  });

  it("writes no words where the caller has them on the screen already", () => {
    const { container } = render(framed(<Mark state={DRAWN} />));

    expect(container.querySelector(`.${slotClass("status-matrix", "name")}`)).toBeNull();
  });
});
