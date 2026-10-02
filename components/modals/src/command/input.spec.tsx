import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, palette, typed } from "#command/command.fixtures.tsx";
import { Input } from "#command/input.tsx";

describe("Input", () => {
  it("renders an input", () => {
    const { container } = render(palette(<Input aria-label="Type a command" />));

    expect(slotElement(container, "command", "input").tagName).toBe("INPUT");
  });

  it("renders no indicator without the indicator prop", () => {
    const { container } = render(palette(<Input aria-label="Type a command" />));

    expect(container.querySelector("[data-part=indicator]")).toBeNull();
  });

  it("renders the indicator prop in the indicator slot", () => {
    const { container } = render(palette(<Input aria-label="Type a command" indicator="s" />));

    expect(slotElement(container, "command", "indicator").textContent).toBe("s");
  });

  it("sets aria-hidden on the indicator", () => {
    const { container } = render(palette(<Input aria-label="Type a command" indicator="s" />));

    expect(slotElement(container, "command", "indicator").getAttribute("aria-hidden")).toBe("true");
  });

  it("drops the rows whose labels do not contain the query", async () => {
    render(composed());
    await typed(screen.getByRole("textbox"), "inv");

    expect(screen.getAllByRole("option")).toHaveLength(1);
  });

  it("keeps a row whose keywords contain the query but whose label does not", async () => {
    render(composed());
    await typed(screen.getByRole("textbox"), "add");

    expect(screen.getByRole("option", { name: /New document/u })).toBeTruthy();
  });

  it("keeps a row whose label differs from the query only in case", async () => {
    render(composed());
    await typed(screen.getByRole("textbox"), "REPORTS");

    expect(screen.getByRole("option", { name: "Reports" })).toBeTruthy();
  });

  it("shows the query in the field after it is typed", async () => {
    render(composed());
    await typed(screen.getByRole("textbox"), "inv");

    expect(screen.getByRole<HTMLInputElement>("textbox").value).toBe("inv");
  });

  it("highlights the first row the query keeps", async () => {
    await drawn(composed());
    screen.getByRole("textbox").focus();
    await settled();
    await typed(screen.getByRole("textbox"), "rep");

    expect(screen.getByRole("textbox").getAttribute("aria-activedescendant")).toBe(
      screen.getByRole("option", { name: "Reports" }).id,
    );
  });
});
