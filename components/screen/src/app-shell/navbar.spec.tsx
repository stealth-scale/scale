import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { bodied, narrowed, tablet } from "#app-shell/app-shell.fixtures.tsx";
import { Navbar } from "#app-shell/navbar.tsx";

describe("Navbar", () => {
  it("renders a div inside the body", () => {
    const { container } = render(bodied(<Navbar />));

    expect(slotElement(container, "app-shell", "navbar").tagName).toBe("DIV");
  });

  it("renders no landmark of its own", () => {
    render(
      bodied(
        <Navbar>
          <nav aria-label="Workspace" />
        </Navbar>,
      ),
    );

    expect(screen.getAllByRole("navigation")).toHaveLength(1);
  });

  it("stays beside the page while the shell is wide enough", () => {
    const { container } = render(bodied(<Navbar />));

    expect(slotElement(container, "app-shell", "navbar").dataset["overlaid"]).toBeUndefined();
  });

  it("folds over the page at a phone width", () => {
    const { container } = render(narrowed(bodied(<Navbar />)));

    expect(slotElement(container, "app-shell", "navbar").dataset["overlaid"]).toBe("");
  });

  it("drops under the page when folds is under", () => {
    const { container } = render(narrowed(bodied(<Navbar folds="under" />)));

    expect(slotElement(container, "app-shell", "navbar").dataset["stacked"]).toBe("");
  });

  it("folds below the breakpoint passed as foldsBelow", () => {
    const { container } = render(tablet(bodied(<Navbar foldsBelow="lg" />)));

    expect(slotElement(container, "app-shell", "navbar").dataset["overlaid"]).toBe("");
  });

  it("stays beside the page at a tablet width by default", () => {
    const { container } = render(tablet(bodied(<Navbar />)));

    expect(slotElement(container, "app-shell", "navbar").dataset["overlaid"]).toBeUndefined();
  });
});
