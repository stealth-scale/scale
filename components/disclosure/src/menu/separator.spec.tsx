import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, listed } from "#menu/menu.fixtures.tsx";
import { Separator } from "#menu/separator.tsx";

describe("Separator", () => {
  it("renders a div", async () => {
    const { container } = await drawn(listed(<Separator />));

    expect(slotElement(container, "menu", "separator").tagName).toBe("DIV");
  });

  it("sets role separator", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("separator")).toBeDefined();
  });

  it("sets aria-orientation horizontal", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("separator").getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(listed(<Separator as="hr" />));

    expect(slotElement(container, "menu", "separator").tagName).toBe("HR");
  });
});
