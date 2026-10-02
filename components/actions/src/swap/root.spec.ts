import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn, violations } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { Root, type RootProps } from "#swap/index.ts";
import { recipe } from "#swap/recipe.ts";
import { composed, toggled } from "#swap/swap.fixtures.tsx";

describe("Root", () => {
  it("returns no accessibility violation inside a toggle button", async () => {
    await expect(accessibilityViolations(() => toggled())).resolves.toStrictEqual([]);
  });

  it("passes the component conformance checks as a span", () => {
    expect(violations(Root, { as: true, children: true, element: "SPAN" })).toStrictEqual([]);
  });

  it("applies the class of every motion to the indicators", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "indicator" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders a span with the root class", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "swap", "root").tagName).toBe("SPAN");
  });

  it("writes data-swap as off while swap is false", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "swap", "root").dataset["swap"]).toBe("off");
  });

  it("writes data-swap as on while swap is true", async () => {
    const { container } = await drawn(composed({ swap: true }));

    expect(slotElement(container, "swap", "root").dataset["swap"]).toBe("on");
  });
});
