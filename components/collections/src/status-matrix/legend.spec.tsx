import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClass } from "@stealthscale/testing-theme";

import { Legend } from "#status-matrix/legend.tsx";
import { type MatrixState } from "#status-matrix/states.ts";
import { framed } from "#status-matrix/status-matrix.fixtures.tsx";

/**
 * Two states without marks.
 */
const STATES: readonly MatrixState[] = [
  { label: "Healthy", tone: "success" },
  { label: "Down", tone: "error" },
];

describe("Legend", () => {
  it("names the list by label", () => {
    render(framed(<Legend label="States" states={STATES} />));

    expect(screen.getByRole("list", { name: "States" })).toBeTruthy();
  });

  it("renders an item per state", () => {
    render(framed(<Legend label="States" states={STATES} />));

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders a state's label beside its mark", () => {
    render(framed(<Legend label="States" states={STATES} />));

    expect(screen.getAllByRole("listitem")[0]?.textContent).toBe("Healthy");
  });

  it("renders no hidden label", () => {
    const { container } = render(framed(<Legend label="States" states={STATES} />));

    expect(container.querySelector(`.${slotClass("status-matrix", "name")}`)).toBeNull();
  });
});
