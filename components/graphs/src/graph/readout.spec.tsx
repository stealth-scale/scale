import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { slotElement, variantClass } from "@stealthscale/testing-theme";

import * as Graph from "#graph/index.ts";
import { Readout, type ReadoutProps } from "#graph/readout.tsx";

function readout(props: Partial<ReadoutProps> = {}): ReturnType<typeof render> {
  return render(
    <Graph.Root>
      <Readout
        clearLabel="Clear focus"
        focused={false}
        onClear={() => {}}
        text="Select a node."
        {...props}
      />
    </Graph.Root>,
  );
}

describe("Readout", () => {
  it("states its text in an output", () => {
    const { getByRole } = readout({ text: "Joined orders: 3 upstream" });

    expect(getByRole("status").textContent).toBe("Joined orders: 3 upstream");
  });

  it("names the clear control by clearLabel", () => {
    const { getByRole } = readout({ clearLabel: "Clear selection" });

    expect(getByRole("button").textContent).toBe("Clear selection");
  });

  it("marks the clear control disabled while nothing is focused", () => {
    const { getByRole } = readout();

    expect(getByRole("button", { name: "Clear focus" }).getAttribute("aria-disabled")).toBe("true");
  });

  it("enables the clear control while a node is focused", () => {
    const { getByRole } = readout({ focused: true });

    expect(getByRole("button", { name: "Clear focus" }).hasAttribute("aria-disabled")).toBe(false);
  });

  it("calls onClear when the enabled control is pressed", () => {
    const onClear = vi.fn<() => void>();
    const { getByRole } = readout({ focused: true, onClear });

    fireEvent.click(getByRole("button", { name: "Clear focus" }));

    expect(onClear).toHaveBeenCalledOnce();
  });

  it("calls nothing when the disabled control is pressed", () => {
    const onClear = vi.fn<() => void>();
    const { getByRole } = readout({ onClear });

    fireEvent.click(getByRole("button", { name: "Clear focus" }));

    expect(onClear).not.toHaveBeenCalled();
  });

  it.each([
    { axis: "size", value: "sm" },
    { axis: "variant", value: "outline" },
  ])("renders the clear control with $axis $value", ({ axis, value }) => {
    const { getByRole } = readout();

    expect(getByRole("button", { name: "Clear focus" }).classList).toContain(
      variantClass("button", axis, value),
    );
  });

  it("renders its children at the row's end", () => {
    const { container } = readout({ children: <span>Overview</span> });

    expect(slotElement(container, "graph", "summary").lastElementChild?.textContent).toBe(
      "Overview",
    );
  });
});
