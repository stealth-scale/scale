import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Description, Title } from "#tour/index.ts";
import { started } from "#tour/tour.fixtures.tsx";

describe("Description", () => {
  it("renders a p", async () => {
    const { container } = await started();

    expect(slotElement(container, "tour", "description").tagName).toBe("P");
  });

  it("shows the step's description", async () => {
    const { container } = await started();

    expect(slotElement(container, "tour", "description").textContent).toBe(
      "Three steps over the page.",
    );
  });

  it("shows its children in place of the step's description", async () => {
    const { container } = await started({
      card: (
        <>
          <Title />
          <Description>Two minutes, four stops.</Description>
        </>
      ),
    });

    expect(slotElement(container, "tour", "description").textContent).toBe(
      "Two minutes, four stops.",
    );
  });
});
