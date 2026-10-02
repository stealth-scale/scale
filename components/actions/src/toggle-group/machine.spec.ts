import { createElement } from "react";

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { Item } from "#toggle-group/item.tsx";
import { splitItemProps, splitToggleGroupProps } from "#toggle-group/machine.ts";
import { composed } from "#toggle-group/toggle-group.fixtures.tsx";

describe("machine", () => {
  it("splits the root's machine options from its element props", () => {
    expect(splitToggleGroupProps({ id: "style", multiple: true, title: "Style" })).toStrictEqual([
      { id: "style", multiple: true },
      { title: "Style" },
    ]);
  });

  it("splits an item's options from its element props", () => {
    expect(splitItemProps({ disabled: true, title: "Bold", value: "bold" })).toStrictEqual([
      { disabled: true, value: "bold" },
      { title: "Bold" },
    ]);
  });

  it("keeps an item ID the caller passes in ids", async () => {
    await drawn(composed({ ids: { item: (value) => `mark-${value.length}` } }));

    expect(screen.getByRole("radio", { name: "Bold" }).id).toBe("mark-4");
  });

  it("throws for an item rendered outside ToggleGroup.Root", () => {
    expect(() => render(createElement(Item, { value: "bold" }))).toThrow("ToggleGroup");
  });
});
