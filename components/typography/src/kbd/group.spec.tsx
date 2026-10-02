import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { recipeClasses, recipeElement, variantClass } from "@stealthscale/testing-theme";

import { Group } from "#kbd/group.tsx";
import { Root } from "#kbd/root.ts";

describe("Group", () => {
  it("passes the component conformance checks as a kbd element", () => {
    expect(violations(Group, { children: true, element: "KBD" })).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(Group, {
        props: { children: [<Root key="command">⌘</Root>, <Root key="k">K</Root>] },
      }),
    ).resolves.toStrictEqual([]);
  });

  it("renders each keycap inside the outer kbd element", () => {
    const { container } = render(
      <Group>
        <Root>⌘</Root>
        <Root>K</Root>
      </Group>,
    );

    expect(recipeElement(container, "kbd-group").querySelectorAll("kbd")).toHaveLength(2);
  });

  it("applies its size to every keycap inside it", () => {
    const { container } = render(
      <Group size="sm">
        <Root>⌘</Root>
      </Group>,
    );

    expect(recipeClasses(container, "kbd")).toContain(variantClass("kbd", "size", "sm"));
  });

  it("applies the size of a keycap that sets its own", () => {
    const { container } = render(
      <Group size="sm">
        <Root size="lg">⌘</Root>
      </Group>,
    );

    expect(recipeClasses(container, "kbd")).toContain(variantClass("kbd", "size", "lg"));
  });

  it("applies the default size to a keycap when the group sets none", () => {
    const { container } = render(
      <Group variant="outline">
        <Root>⌘</Root>
      </Group>,
    );

    expect(recipeClasses(container, "kbd")).toContain(variantClass("kbd", "size", "md"));
  });

  it("applies its palette to every keycap inside it", () => {
    const { container } = render(
      <Group palette="primary">
        <Root>⌘</Root>
      </Group>,
    );

    expect(recipeClasses(container, "kbd")).toContain(variantClass("kbd", "palette", "primary"));
  });
});
