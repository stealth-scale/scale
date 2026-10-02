import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#splitter/recipe.ts";
import { type RootProps } from "#splitter/root.tsx";
import { measured, split } from "#splitter/splitter.fixtures.tsx";

describe("Root", () => {
  it("returns no accessibility violation with two panels and a trigger", async () => {
    measured();

    await expect(accessibilityViolations(() => split())).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", async () => {
    measured();

    await expect(
      boundMachineViolations(
        recipe,
        async (props: Omit<RootProps, "splitter">) =>
          (await drawn(split({ root: props }))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("sets data-orientation to the machine's orientation", async () => {
    measured();
    const { container } = await drawn(split({ options: { orientation: "vertical" } }));

    expect(slotElement(container, "splitter", "root").dataset["orientation"]).toBe("vertical");
  });

  it("leaves out the machine's inline layout", async () => {
    measured();
    const { container } = await drawn(split());

    expect(slotElement(container, "splitter", "root").getAttribute("style")).toBeNull();
  });

  it("derives the element's id from the machine's id", async () => {
    measured();
    const { container } = await drawn(split({ options: { id: "editor" } }));

    expect(slotElement(container, "splitter", "root").id).toBe("splitter:editor");
  });

  it("renders the element passed as as", async () => {
    measured();
    const { container } = await drawn(split({ root: { as: "section" } }));

    expect(slotElement(container, "splitter", "root").tagName).toBe("SECTION");
  });
});
