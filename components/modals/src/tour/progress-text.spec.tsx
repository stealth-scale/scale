import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Description, ProgressText, Title } from "#tour/index.ts";
import { started, stepped, steps } from "#tour/tour.fixtures.tsx";

describe("ProgressText", () => {
  it("renders a div", async () => {
    const { container } = await started();

    expect(slotElement(container, "tour", "progressText").tagName).toBe("DIV");
  });

  it("counts the first step of three", async () => {
    const { container } = await started();

    expect(slotElement(container, "tour", "progressText").textContent).toBe("1 of 3");
  });

  it("counts the step the tour moved to", async () => {
    const { container } = await started();

    await stepped("Start");

    expect(slotElement(container, "tour", "progressText").textContent).toBe("2 of 3");
  });

  it("leaves a wait step out of the count", async () => {
    const { container } = await started({
      options: { steps: [...steps(), { description: "", id: "typed", title: "", type: "wait" }] },
    });

    expect(slotElement(container, "tour", "progressText").textContent).toBe("1 of 3");
  });

  it("shows its children in place of the count", async () => {
    const { container } = await started({
      card: (
        <>
          <Title />
          <Description />
          <ProgressText>Stop 1 of 3</ProgressText>
        </>
      ),
    });

    expect(slotElement(container, "tour", "progressText").textContent).toBe("Stop 1 of 3");
  });
});
