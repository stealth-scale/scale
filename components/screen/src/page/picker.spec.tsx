import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement, variantClass } from "@stealthscale/testing-theme";

import { paged } from "#page/page.fixtures.tsx";
import { Picker } from "#page/picker.ts";

describe("Picker", () => {
  it("renders a button", () => {
    const { container } = render(paged(<Picker>Lines</Picker>));

    expect(slotElement(container, "page", "picker").tagName).toBe("BUTTON");
  });

  it("sets type button", () => {
    render(paged(<Picker>Lines</Picker>));

    expect(screen.getByRole("button").getAttribute("type")).toBe("button");
  });

  it("renders the library's button in the outline look", () => {
    render(paged(<Picker>Lines</Picker>));

    expect(screen.getByRole("button").classList).toContain(
      variantClass("button", "variant", "outline"),
    );
  });
});
