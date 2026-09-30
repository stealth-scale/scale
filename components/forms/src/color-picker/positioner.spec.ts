import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { opened, picker } from "#color-picker/color-picker.fixtures.tsx";

describe("Positioner", () => {
  it("renders nothing before the panel first opens", async () => {
    const { container } = await drawn(picker());

    expect(container.querySelector(".color-picker__positioner")).toBeNull();
  });

  it("renders a div once the panel opens", async () => {
    const { container } = await drawn(picker());

    await opened();

    expect(container.querySelector(".color-picker__positioner")?.tagName).toBe("DIV");
  });
});
