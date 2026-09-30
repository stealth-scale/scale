import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotClass, slotElement } from "@stealthscale/testing-theme";

import { composed } from "#pagination/pagination.fixtures.tsx";

/**
 * Selects every mark between distant pages.
 */
const MARKS = `.${slotClass("pagination", "ellipsis")}`;

describe("Items", () => {
  it("renders a button for every page the machine shows", async () => {
    await drawn(composed());

    expect(
      screen
        .getAllByRole("button", { name: /^Page \d+$/u })
        .map((page) => page.getAttribute("aria-label")),
    ).toStrictEqual(["Page 1", "Page 11", "Page 12", "Page 13", "Page 24"]);
  });

  it("renders a mark for every run of pages left out", async () => {
    const { container } = await drawn(composed());

    expect(container.querySelectorAll(MARKS)).toHaveLength(2);
  });

  it("renders no mark when every page shows", async () => {
    const { container } = await drawn(composed({ count: 50, defaultPage: 1 }));

    expect(container.querySelectorAll(MARKS)).toHaveLength(0);
  });

  it("names every page with the words label returns", async () => {
    await drawn(composed({}, { label: (page) => `Seite ${page}` }));

    expect(screen.getByRole("button", { name: "Seite 12" }).textContent).toBe("12");
  });

  it("renders the summary as an output", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "pagination", "summary").tagName).toBe("OUTPUT");
  });

  it("renders the summary after the last page", async () => {
    const { container } = await drawn(composed());
    const summary = slotElement(container, "pagination", "summary");

    expect(summary.previousElementSibling?.getAttribute("aria-label")).toBe("Page 24");
  });

  it("words the summary compact by default", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "pagination", "summary").textContent).toBe("Page 12 of 24");
  });

  it("words the summary in the format summary names", async () => {
    const { container } = await drawn(composed({}, { summary: "short" }));

    expect(slotElement(container, "pagination", "summary").textContent).toBe("12 / 24");
  });

  it("words the summary with the words a function returns", async () => {
    const { container } = await drawn(
      composed({}, { summary: ({ page, totalPages }) => `Seite ${page} von ${totalPages}` }),
    );

    expect(slotElement(container, "pagination", "summary").textContent).toBe("Seite 12 von 24");
  });
});
