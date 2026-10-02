import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, narrowed, shell } from "#app-shell/app-shell.fixtures.tsx";
import { Status } from "#app-shell/status.tsx";

describe("Status", () => {
  it("renders a div inside the root", () => {
    const { container } = render(shell(<Status>Saved</Status>));

    expect(slotElement(container, "app-shell", "status").tagName).toBe("DIV");
  });

  it("exposes no role", () => {
    const { container } = render(shell(<Status>Saved</Status>));

    expect(slotElement(container, "app-shell", "status").getAttribute("role")).toBeNull();
  });

  it("is not a live region", () => {
    const { container } = render(shell(<Status>Saved</Status>));

    expect(slotElement(container, "app-shell", "status").getAttribute("aria-live")).toBeNull();
  });

  it("renders its entries", () => {
    const { container } = render(shell(<Status>Saved</Status>));

    expect(slotElement(container, "app-shell", "status").textContent).toBe("Saved");
  });

  it("passes the div its props", () => {
    const { container } = render(shell(<Status title="Sync">Saved</Status>));

    expect(slotElement(container, "app-shell", "status").getAttribute("title")).toBe("Sync");
  });

  it("becomes inert while a panel is over the page", async () => {
    const { container } = render(narrowed(composed()));

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(slotElement(container, "app-shell", "status").inert).toBe(true);
  });

  it("is not inert while no panel is over the page", () => {
    const { container } = render(narrowed(composed()));

    expect(slotElement(container, "app-shell", "status").inert).toBe(false);
  });
});
