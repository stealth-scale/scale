import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, narrowed, shell } from "#app-shell/app-shell.fixtures.tsx";
import { Footer } from "#app-shell/footer.tsx";

describe("Footer", () => {
  it("renders a footer inside the root", () => {
    const { container } = render(shell(<Footer>Acme</Footer>));

    expect(slotElement(container, "app-shell", "footer").tagName).toBe("FOOTER");
  });

  it("exposes the contentinfo landmark", () => {
    render(shell(<Footer>Acme</Footer>));

    expect(screen.getByRole("contentinfo")).toBeTruthy();
  });

  it("omits data-sticky when sticky is not passed", () => {
    const { container } = render(shell(<Footer>Acme</Footer>));

    expect(slotElement(container, "app-shell", "footer").dataset["sticky"]).toBeUndefined();
  });

  it("writes data-sticky when sticky is passed", () => {
    const { container } = render(shell(<Footer sticky>Acme</Footer>));

    expect(slotElement(container, "app-shell", "footer").dataset["sticky"]).toBe("");
  });

  it("becomes inert while a panel is over the page", async () => {
    const { container } = render(narrowed(composed()));

    await pressed(screen.getByRole("button", { name: "Navigation" }));

    expect(slotElement(container, "app-shell", "footer").inert).toBe(true);
  });
});
