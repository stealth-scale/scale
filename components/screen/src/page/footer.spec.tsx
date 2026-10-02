import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Footer } from "#page/footer.tsx";
import { paged } from "#page/page.fixtures.tsx";

describe("Footer", () => {
  it("renders a footer", () => {
    const { container } = render(paged(<Footer>Paid on 3 May</Footer>));

    expect(slotElement(container, "page", "footer").tagName).toBe("FOOTER");
  });

  it("sets data-sticky when sticky", () => {
    const { container } = render(paged(<Footer sticky>Paid on 3 May</Footer>));

    expect(slotElement(container, "page", "footer").dataset["sticky"]).toBe("");
  });

  it("renders on a narrow page when when is narrow", () => {
    render(narrowed(paged(<Footer when="narrow">Paid on 3 May</Footer>)));

    expect(screen.getByText("Paid on 3 May")).toBeTruthy();
  });

  it("renders nothing on a wide page when when is narrow", () => {
    render(paged(<Footer when="narrow">Paid on 3 May</Footer>));

    expect(screen.queryByText("Paid on 3 May")).toBeNull();
  });
});
