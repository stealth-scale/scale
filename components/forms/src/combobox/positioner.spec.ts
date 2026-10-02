import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { opened, picked } from "#combobox/combobox.fixtures.tsx";

describe("Positioner", () => {
  it("renders nothing before the panel first opens", async () => {
    const { container } = await drawn(picked());

    expect(container.querySelector(".combobox__positioner")).toBeNull();
  });

  it("renders a div once the panel opens", async () => {
    const { container } = await drawn(picked());

    await opened();

    expect(container.querySelector(".combobox__positioner")?.tagName).toBe("DIV");
  });

  it("makes the panel as wide as the control", async () => {
    const { container } = await drawn(picked());

    await opened();

    expect(container.querySelector<HTMLElement>(".combobox__positioner")?.style.width).toBe(
      "var(--reference-width)",
    );
  });
});
