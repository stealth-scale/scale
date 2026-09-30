import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#scroll-area/recipe.ts";
import { type RootProps } from "#scroll-area/root.tsx";
import { scrolled } from "#scroll-area/scroll-area.fixtures.tsx";

describe("Root", () => {
  it("renders a div", async () => {
    const { container } = await drawn(scrolled());

    expect(slotElement(container, "scroll-area", "root").tagName).toBe("DIV");
  });

  it("takes no role", async () => {
    const { container } = await drawn(scrolled());

    expect(slotElement(container, "scroll-area", "root").getAttribute("role")).toBeNull();
  });

  it("writes the direction the caller passes to the machine", async () => {
    const { container } = await drawn(scrolled({ dir: "rtl" }));

    expect(slotElement(container, "scroll-area", "root").getAttribute("dir")).toBe("rtl");
  });

  it("names the root's id after the caller's id", async () => {
    const { container } = await drawn(scrolled({ id: "notes" }));

    expect(slotElement(container, "scroll-area", "root").id).toBe("scroll-area-notes");
  });

  it("keeps the caller's class", async () => {
    const { container } = await drawn(scrolled({ className: "notes" }));

    expect(slotElement(container, "scroll-area", "root").classList).toContain("notes");
  });

  it("applies the class of every variant value", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: Partial<RootProps>) => (await drawn(scrolled(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(accessibilityViolations(() => scrolled())).resolves.toStrictEqual([]);
  });
});
