import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#steps/indicator.tsx";
import { itemed } from "#steps/steps.fixtures.tsx";

describe("Indicator", () => {
  it("renders a span hidden from assistive technology", async () => {
    const { container } = await drawn(itemed(<Indicator />));
    const disc = slotElement(container, "steps", "indicator");

    expect([disc.tagName, disc.getAttribute("aria-hidden")]).toStrictEqual(["SPAN", "true"]);
  });

  it("shows the step's number counted from one without children", async () => {
    const { container } = await drawn(itemed(<Indicator />, {}, 1));

    expect(slotElement(container, "steps", "indicator").textContent).toBe("2");
  });

  it("shows its children in place of the number", async () => {
    const { container } = await drawn(itemed(<Indicator>A</Indicator>));

    expect(slotElement(container, "steps", "indicator").textContent).toBe("A");
  });

  it("sets data-current on the current step's disc", async () => {
    const { container } = await drawn(itemed(<Indicator />));

    expect(slotElement(container, "steps", "indicator").dataset["current"]).toBe("");
  });

  it("sets data-complete on a completed step's disc", async () => {
    const { container } = await drawn(itemed(<Indicator />, { defaultStep: 2 }));

    expect(slotElement(container, "steps", "indicator").dataset["complete"]).toBe("");
  });
});
