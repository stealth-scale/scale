import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { composed, palette, typed } from "#command/command.fixtures.tsx";
import { Empty } from "#command/empty.ts";

describe("Empty", () => {
  it("renders a p element for the empty slot", () => {
    const { container } = render(palette(<Empty>No commands match</Empty>));

    expect(slotElement(container, "command", "empty").tagName).toBe("P");
  });

  it("stays out of the document while the collection has matches", () => {
    render(composed());

    expect(screen.queryByText("No commands match")).toBeNull();
  });

  it("enters the document once a query matches no action", async () => {
    render(composed());
    await typed(screen.getByRole("textbox"), "zzz");

    expect(screen.getByText("No commands match")).toBeTruthy();
  });

  it("replaces the rows rather than sitting beside them when nothing matches", async () => {
    render(composed());
    await typed(screen.getByRole("textbox"), "zzz");

    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });
});
