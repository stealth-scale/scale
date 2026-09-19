import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#toc/recipe.ts";
import { type RootProps } from "#toc/root.tsx";
import { composed, ITEMS } from "#toc/toc.fixtures.tsx";

describe("Root", () => {
  it("breaks no accessibility rule holding a title and a list of links", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("draws a navigation landmark named by its title", async () => {
    await drawn(composed());

    expect(screen.getByRole("navigation", { name: "On this page" })).toBeDefined();
  });

  it("lists one link per heading", async () => {
    await drawn(composed());

    expect(screen.getAllByRole("link").map((link) => link.textContent)).toStrictEqual(
      ITEMS.map((item) => item.value),
    );
  });

  it("marks the headings a caller says are on screen", async () => {
    await drawn(composed({ defaultActiveIds: ["large"] }));

    expect(screen.getByRole("link", { name: "large" }).getAttribute("aria-current")).toBe(
      "location",
    );
    expect(screen.getByRole("link", { name: "sizes" }).getAttribute("aria-current")).toBeNull();
  });

  it("names the machine by the id a caller states", async () => {
    const { container } = await drawn(composed({ id: "contents" }));

    expect(slotElement(container, "toc", "root").id).toBe("toc:contents");
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(composed({ as: "aside" }));

    expect(slotElement(container, "toc", "root").tagName).toBe("ASIDE");
  });
});
