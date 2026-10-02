import { act, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, observer } from "#steps/steps.fixtures.tsx";

describe("List", () => {
  it("renders an ordered list of the steps", async () => {
    await drawn(composed());

    expect(screen.getByRole("list").tagName).toBe("OL");
  });

  it("drops the machine's tablist role", async () => {
    await drawn(composed());

    expect(screen.queryByRole("tablist")).toBeNull();
  });

  it("drops aria-owns and aria-orientation", async () => {
    const { container } = await drawn(composed());
    const list = slotElement(container, "steps", "list");

    expect([list.hasAttribute("aria-owns"), list.hasAttribute("aria-orientation")]).toStrictEqual([
      false,
      false,
    ]);
  });

  it("sets data-orientation from the machine", async () => {
    const { container } = await drawn(composed({ orientation: "vertical" }));

    expect(slotElement(container, "steps", "list").dataset["orientation"]).toBe("vertical");
  });

  it("sets data-crowded once a resize finds the steps too wide", async () => {
    const stub = observer();
    const { container } = await drawn(composed());

    vi.spyOn(HTMLElement.prototype, "scrollWidth", "get").mockReturnValue(400);
    vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockReturnValue(354);
    act(() => {
      stub.resize();
    });

    expect(slotElement(container, "steps", "list").dataset["crowded"]).toBe("");
  });

  it("leaves data-crowded out while the steps fit", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "steps", "list").dataset["crowded"]).toBeUndefined();
  });
});
