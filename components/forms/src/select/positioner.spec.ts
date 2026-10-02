import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { opened, picked } from "#select/select.fixtures.tsx";

describe("Positioner", () => {
  it("renders nothing before the panel first opens", async () => {
    const { container } = await drawn(picked());

    expect(container.querySelector(".select__positioner")).toBeNull();
  });

  it("renders a div once the panel opens", async () => {
    const { container } = await drawn(picked());

    await opened();

    expect(container.querySelector(".select__positioner")?.tagName).toBe("DIV");
  });
});
