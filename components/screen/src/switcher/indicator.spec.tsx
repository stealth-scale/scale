import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Indicator } from "#switcher/indicator.ts";
import { held } from "#switcher/parts.fixtures.tsx";

describe("Indicator", () => {
  it("renders inside the trigger", () => {
    const { container } = render(held(<Indicator>v</Indicator>));

    expect(slotElement(container, "switcher", "indicator")).toBeTruthy();
  });

  it("reports the menu's state in data-state", () => {
    const { container } = render(held(<Indicator>v</Indicator>));

    expect(slotElement(container, "switcher", "indicator").dataset["state"]).toBe("closed");
  });
});
