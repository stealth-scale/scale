import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Label } from "#stat/label.ts";
import { stated } from "#stat/stat.fixtures.tsx";

describe("Label", () => {
  it("renders a DT for the label slot", () => {
    const { container } = render(stated(<Label>Raised</Label>));

    expect(slotElement(container, "stat", "label").tagName).toBe("DT");
  });
});
