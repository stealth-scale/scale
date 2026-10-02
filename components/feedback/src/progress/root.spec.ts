import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { labelled } from "#progress/progress.fixtures.tsx";
import { recipe } from "#progress/recipe.ts";
import { type RootProps } from "#progress/root.tsx";

describe("Root", () => {
  it("renders a DIV for the root slot", async () => {
    const { container } = await drawn(labelled());

    expect(slotElement(container, "progress", "root").tagName).toBe("DIV");
  });

  it("returns no accessibility violation for a labelled bar", async () => {
    await expect(accessibilityViolations(() => labelled({ value: 62 }))).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation for a bar whose value is unknown", async () => {
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

  it("starts halfway without a value", async () => {
    await drawn(labelled());

    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("50");
  });

  it("counts from min to max", async () => {
    await drawn(labelled({ max: 4200, value: 2650 }));

    expect(screen.getByRole("progressbar").getAttribute("aria-valuemax")).toBe("4200");
  });

  it("writes data-state complete at the maximum", async () => {
    const { container } = await drawn(labelled({ value: 100 }));

    expect(slotElement(container, "progress", "root").dataset["state"]).toBe("complete");
  });
});
