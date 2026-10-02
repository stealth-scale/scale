import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { labelled } from "#progress-circle/progress-circle.fixtures.tsx";
import { recipe } from "#progress-circle/recipe.ts";
import { type RootProps } from "#progress-circle/root.tsx";

describe("Root", () => {
  it("renders a div for the root slot", async () => {
    const { container } = await drawn(labelled());

    expect(slotElement(container, "progress-circle", "root").tagName).toBe("DIV");
  });

  it("returns no accessibility violation for a labelled ring", async () => {
    await expect(accessibilityViolations(() => labelled({ value: 62 }))).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation for a ring whose value is unknown", async () => {
    await expect(accessibilityViolations(() => labelled({ value: null }))).resolves.toStrictEqual(
      [],
    );
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(labelled(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("counts from min to max", async () => {
    await drawn(labelled({ max: 5, value: 3 }));

    expect(screen.getByRole("progressbar").getAttribute("aria-valuemax")).toBe("5");
  });

  it("writes data-state complete at the maximum", async () => {
    const { container } = await drawn(labelled({ value: 100 }));

    expect(slotElement(container, "progress-circle", "root").dataset["state"]).toBe("complete");
  });
});
