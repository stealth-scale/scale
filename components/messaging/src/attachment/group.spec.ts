import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement, variantClass } from "@stealthscale/testing-theme";

import { grouped } from "#attachment/attachment.fixtures.tsx";
import { Group } from "#attachment/group.tsx";

describe("Group", () => {
  it("returns no conformance violation for its UL root", () => {
    expect(violations(Group, { as: true, children: true, element: "UL" })).toStrictEqual([]);
  });

  it("renders a list named by aria-label", () => {
    render(grouped());

    expect(screen.getByRole("list", { name: "Attachments" }).tagName).toBe("UL");
  });

  it("applies the orientation class passed as orientation", () => {
    const { container } = render(grouped({ orientation: "vertical" }));

    expect(slotElement(container, "attachment", "group").className).toContain(
      variantClass("attachment__group", "orientation", "vertical"),
    );
  });
});
