import { type ReactElement } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Search, type SearchProps } from "#toolbar/search.tsx";
import { ranged } from "#toolbar/toolbar.fixtures.tsx";

/**
 * Renders a search named `Search invoices` on a narrow row.
 */
function folding(props: SearchProps = {}): ReactElement {
  return narrowed(ranged(<Search aria-label="Search invoices" {...props} />));
}

/**
 * Presses the button the search folds to.
 */
function opened(): void {
  fireEvent.click(screen.getByRole("button", { name: "Search invoices" }));
}

describe("Search", () => {
  it("renders the search input inside the search div on a wide row", () => {
    const { container } = render(ranged(<Search />));

    expect(
      slotElement(container, "toolbar", "search").contains(screen.getByRole("searchbox")),
    ).toBe(true);
  });

  it("names the field Search by default", () => {
    render(ranged(<Search />));

    expect(screen.getByRole("searchbox", { name: "Search" })).toBeTruthy();
  });

  it("names the field by aria-label", () => {
    render(ranged(<Search aria-label="Search invoices" />));

    expect(screen.getByRole("searchbox", { name: "Search invoices" })).toBeTruthy();
  });

  it("renders searchIndicator in the field", () => {
    const { container } = render(ranged(<Search searchIndicator={<svg data-mark="" />} />));

    expect(container.querySelector("[data-mark]")).not.toBeNull();
  });

  it("renders no folded button on a wide row", () => {
    render(ranged(<Search aria-label="Search invoices" />));

    expect(screen.queryByRole("button", { name: "Search invoices" })).toBeNull();
  });

  it("sets no data-opened on a wide row", () => {
    const { container } = render(ranged(<Search />));

    expect(slotElement(container, "toolbar", "search").dataset["opened"]).toBeUndefined();
  });

  it("renders no field on a narrow row until the folded button is pressed", () => {
    render(folding());

    expect(screen.queryByRole("searchbox")).toBeNull();
  });

  it("shows the name on the folded button without a searchIndicator", () => {
    render(folding());

    expect(screen.getByRole("button", { name: "Search invoices" }).textContent).toBe(
      "Search invoices",
    );
  });

  it("names the folded button with aria-label when it shows the searchIndicator", () => {
    render(folding({ searchIndicator: <svg aria-hidden="true" /> }));

    expect(screen.getByRole("button", { name: "Search invoices" }).getAttribute("aria-label")).toBe(
      "Search invoices",
    );
  });

  it("names the folded button Search by default", () => {
    render(narrowed(ranged(<Search searchIndicator={<svg aria-hidden="true" />} />)));

    expect(screen.getByRole("button", { name: "Search" })).toBeTruthy();
  });

  it("opens over the row when the folded button is pressed", () => {
    const { container } = render(folding());

    opened();

    expect(slotElement(container, "toolbar", "search").dataset["opened"]).toBe("");
  });

  it("focuses the field when the folded button opens it", () => {
    render(folding());

    opened();

    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });

  it("sets aria-expanded on the folded button while open", () => {
    render(folding());

    opened();

    expect(
      screen.getByRole("button", { name: "Search invoices" }).getAttribute("aria-expanded"),
    ).toBe("true");
  });

  it("closes on Escape in the empty field", () => {
    render(folding());
    opened();

    fireEvent.keyDown(screen.getByRole("searchbox"), { key: "Escape" });

    expect(screen.queryByRole("searchbox")).toBeNull();
  });

  it("empties a filled field on the first Escape and keeps it open", () => {
    render(folding());
    opened();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "April" } });

    fireEvent.keyDown(screen.getByRole("searchbox"), { key: "Escape" });

    expect(screen.getByRole<HTMLInputElement>("searchbox").value).toBe("");
  });

  it("keeps the field open on a key other than Escape", () => {
    render(folding());
    opened();

    fireEvent.keyDown(screen.getByRole("searchbox"), { key: "a" });

    expect(screen.getByRole("searchbox")).toBeTruthy();
  });

  it("returns focus to the folded button when Escape closes it", () => {
    render(folding());
    opened();

    fireEvent.keyDown(screen.getByRole("searchbox"), { key: "Escape" });

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Search invoices" }));
  });

  it("closes when focus leaves the empty field", () => {
    render(folding());
    opened();

    fireEvent.focusOut(screen.getByRole("searchbox"), { relatedTarget: null });

    expect(screen.queryByRole("searchbox")).toBeNull();
  });

  it("keeps the field open when focus leaves a filled field", () => {
    render(folding());
    opened();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "April" } });

    fireEvent.focusOut(screen.getByRole("searchbox"), { relatedTarget: null });

    expect(screen.getByRole("searchbox")).toBeTruthy();
  });

  it("keeps the field open when focus moves to its clear control", () => {
    render(folding({ clearIndicator: "x", clearLabel: "Clear" }));
    opened();
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "May" } });

    fireEvent.focusOut(screen.getByRole("searchbox"), {
      relatedTarget: screen.getByRole("button", { name: "Clear" }),
    });

    expect(screen.getByRole("searchbox")).toBeTruthy();
  });

  it("calls the caller's onKeyDown", () => {
    const onKeyDown = vi.fn<() => void>();

    render(folding({ onKeyDown }));
    opened();
    fireEvent.keyDown(screen.getByRole("searchbox"), { key: "a" });

    expect(onKeyDown).toHaveBeenCalledOnce();
  });

  it("calls the caller's onBlur", () => {
    const onBlur = vi.fn<() => void>();

    render(folding({ onBlur }));
    opened();
    fireEvent.blur(screen.getByRole("searchbox"));

    expect(onBlur).toHaveBeenCalledOnce();
  });
});
