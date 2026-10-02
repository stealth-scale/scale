import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Name } from "#switcher/name.ts";
import { held } from "#switcher/parts.fixtures.tsx";

describe("Name", () => {
  it("renders a span inside the trigger", () => {
    const { container } = render(held(<Name>Acme</Name>));

    expect(slotElement(container, "switcher", "name").tagName).toBe("SPAN");
  });

  it("is part of the trigger's accessible name", () => {
    render(held(<Name>Acme</Name>));

    expect(screen.getByRole("button", { name: "Workspace Acme" })).toBeTruthy();
  });
});
