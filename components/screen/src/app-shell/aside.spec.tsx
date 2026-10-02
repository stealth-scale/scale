import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { bodied, narrowed, tablet } from "#app-shell/app-shell.fixtures.tsx";
import { Aside } from "#app-shell/aside.tsx";

describe("Aside", () => {
  it("renders an aside inside the body", () => {
    const { container } = render(bodied(<Aside />));

    expect(slotElement(container, "app-shell", "aside").tagName).toBe("ASIDE");
  });

  it("exposes a complementary landmark named by aria-label", () => {
    render(bodied(<Aside aria-label="Detail" />));

    expect(screen.getByRole("complementary", { name: "Detail" })).toBeTruthy();
  });

  it("folds over the page at a tablet width", () => {
    const { container } = render(tablet(bodied(<Aside aria-label="Detail" />)));

    expect(slotElement(container, "app-shell", "aside").dataset["overlaid"]).toBe("");
  });

  it("folds over the page at a phone width", () => {
    const { container } = render(narrowed(bodied(<Aside />)));

    expect(slotElement(container, "app-shell", "aside").dataset["overlaid"]).toBe("");
  });

  it("drops under the page open when folds is under", () => {
    const { container } = render(narrowed(bodied(<Aside folds="under" />)));
    const track = slotElement(container, "app-shell", "aside");

    expect(track.dataset["stacked"]).toBe("");
    expect(track.dataset["state"]).toBe("open");
  });
});
