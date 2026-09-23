import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#toc/recipe.ts";
import { type RootProps } from "#toc/root.tsx";
import { composed, ITEMS } from "#toc/toc.fixtures.tsx";

describe("Root", () => {
  it("returns no accessibility violation when it holds a title and a list", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders a navigation landmark named by Toc.Title", async () => {
    await drawn(composed());

    expect(screen.getByRole("navigation", { name: "On this page" })).toBeDefined();
  });

  it("renders one link per item", async () => {
    await drawn(composed());

    expect(screen.getAllByRole("link").map((link) => link.textContent)).toStrictEqual(
      ITEMS.map((item) => item.value),
    );
  });

  it("sets aria-current only on the links in defaultActiveIds", async () => {
    await drawn(composed({ defaultActiveIds: ["large"] }));

    expect(screen.getByRole("link", { name: "large" }).getAttribute("aria-current")).toBe(
      "location",
    );
    expect(screen.getByRole("link", { name: "sizes" }).getAttribute("aria-current")).toBeNull();
  });

  it("derives the element id from the id prop", async () => {
    const { container } = await drawn(composed({ id: "contents" }));

    expect(slotElement(container, "toc", "root").id).toBe("toc:contents");
  });

  it("renders the element passed as as", async () => {
    const { container } = await drawn(composed({ as: "aside" }));

    expect(slotElement(container, "toc", "root").tagName).toBe("ASIDE");
  });
});
