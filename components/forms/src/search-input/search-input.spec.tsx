import { type ReactElement, useState } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { slotElement, variantClass } from "@stealthscale/testing-theme";

import { SearchInput } from "#search-input/search-input.tsx";

/**
 * Renders a search field whose value the caller holds.
 */
function Driven(): ReactElement {
  const [held, setHeld] = useState("");

  return <SearchInput aria-label="Search" onValueChange={setHeld} value={held} />;
}

describe("SearchInput", () => {
  it("returns no accessibility violation when named with aria-label", async () => {
    await expect(
      accessibilityViolations(SearchInput, {
        props: {
          "aria-label": "Search invoices",
          clearIndicator: "x",
          defaultValue: "unpaid",
          searchIndicator: "?",
        },
      }),
    ).resolves.toStrictEqual([]);
  });

  it("renders an input of type search", () => {
    render(<SearchInput aria-label="Search" />);

    expect(screen.getByRole("searchbox").getAttribute("type")).toBe("search");
  });

  it("sets enterKeyHint to search", () => {
    render(<SearchInput aria-label="Search" />);

    expect(screen.getByRole("searchbox").getAttribute("enterkeyhint")).toBe("search");
  });

  it("passes size to the input group", () => {
    const { container } = render(<SearchInput aria-label="Search" size="lg" />);

    expect([...slotElement(container, "input-group", "root").classList]).toContain(
      variantClass("input-group__root", "size", "lg"),
    );
  });

  it("passes variant to the input group", () => {
    const { container } = render(<SearchInput aria-label="Search" variant="subtle" />);

    expect([...slotElement(container, "input-group", "root").classList]).toContain(
      variantClass("input-group__root", "variant", "subtle"),
    );
  });

  it("passes size to the clear control", () => {
    render(
      <SearchInput aria-label="Search" clearIndicator="x" defaultValue="invoices" size="lg" />,
    );

    expect([...screen.getByRole("button", { name: "Clear search" }).classList]).toContain(
      variantClass("search-input", "size", "lg"),
    );
  });

  it("renders searchIndicator in a hidden mark before the field", () => {
    const { container } = render(<SearchInput aria-label="Search" searchIndicator="?" />);
    const mark = slotElement(container, "input-group", "mark");

    expect(mark.getAttribute("aria-hidden")).toBe("true");
    expect(mark.nextElementSibling).toBe(screen.getByRole("searchbox"));
  });

  it("renders no mark when searchIndicator is absent", () => {
    const { container } = render(<SearchInput aria-label="Search" />);

    expect(container.querySelector("[class*=input-group__mark]")).toBeNull();
  });

  it("renders no clear control when the value is empty", () => {
    render(<SearchInput aria-label="Search" clearIndicator="x" />);

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders no clear control when clearIndicator is absent", () => {
    render(<SearchInput aria-label="Search" defaultValue="invoices" />);

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders the clear control when the value is not empty", () => {
    render(<SearchInput aria-label="Search" clearIndicator="x" defaultValue="invoices" />);

    expect(screen.getByRole("button", { name: "Clear search" })).toBeDefined();
  });

  it("names the clear control with clearLabel", () => {
    render(
      <SearchInput
        aria-label="Search"
        clearIndicator="x"
        clearLabel="Empty the search"
        defaultValue="invoices"
      />,
    );

    expect(screen.getByRole("button", { name: "Empty the search" })).toBeDefined();
  });

  it("takes the clear control out of the tab order", () => {
    render(<SearchInput aria-label="Search" clearIndicator="x" defaultValue="invoices" />);

    expect(screen.getByRole("button", { name: "Clear search" }).getAttribute("tabindex")).toBe(
      "-1",
    );
  });

  it("sets type button on the clear control", () => {
    render(<SearchInput aria-label="Search" clearIndicator="x" defaultValue="invoices" />);

    expect(screen.getByRole("button", { name: "Clear search" }).getAttribute("type")).toBe(
      "button",
    );
  });

  it("calls onValueChange with the new value on every change", () => {
    const told = vi.fn<(value: string) => void>();

    render(<SearchInput aria-label="Search" onValueChange={told} />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "ab" } });

    expect(told).toHaveBeenLastCalledWith("ab");
  });

  it("empties the field when the clear control is pressed", () => {
    render(<SearchInput aria-label="Search" clearIndicator="x" defaultValue="invoices" />);
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));

    expect(screen.getByRole("searchbox")).toHaveProperty("value", "");
  });

  it("moves focus to the field when the clear control is pressed", () => {
    render(<SearchInput aria-label="Search" clearIndicator="x" defaultValue="invoices" />);
    fireEvent.click(screen.getByRole("button", { name: "Clear search" }));

    expect(document.activeElement).toBe(screen.getByRole("searchbox"));
  });

  it("empties a non-empty field on Escape", () => {
    render(<SearchInput aria-label="Search" defaultValue="invoices" />);
    fireEvent.keyDown(screen.getByRole("searchbox"), { key: "Escape" });

    expect(screen.getByRole("searchbox")).toHaveProperty("value", "");
  });

  it("stops Escape from reaching its ancestors when it clears the field", () => {
    const heard = vi.fn<() => void>();

    render(
      <div onKeyDown={heard} role="presentation">
        <SearchInput aria-label="Search" defaultValue="invoices" />
      </div>,
    );
    fireEvent.keyDown(screen.getByRole("searchbox"), { key: "Escape" });

    expect(heard).not.toHaveBeenCalled();
  });

  it("passes Escape on when the field is empty", () => {
    const heard = vi.fn<() => void>();

    render(
      <div onKeyDown={heard} role="presentation">
        <SearchInput aria-label="Search" />
      </div>,
    );
    fireEvent.keyDown(screen.getByRole("searchbox"), { key: "Escape" });

    expect(heard).toHaveBeenCalledOnce();
  });

  it("keeps the value when onKeyDown prevents the default on Escape", () => {
    render(
      <SearchInput
        aria-label="Search"
        defaultValue="invoices"
        onKeyDown={(event) => {
          event.preventDefault();
        }}
      />,
    );
    fireEvent.keyDown(screen.getByRole("searchbox"), { key: "Escape" });

    expect(screen.getByRole("searchbox")).toHaveProperty("value", "invoices");
  });

  it("calls onSubmit with the value on Enter", () => {
    const submitted = vi.fn<(value: string) => void>();

    render(<SearchInput aria-label="Search" defaultValue="invoices" onSubmit={submitted} />);
    fireEvent.keyDown(screen.getByRole("searchbox"), { key: "Enter" });

    expect(submitted).toHaveBeenCalledWith("invoices");
  });

  it("renders the value its caller holds", () => {
    render(<Driven />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "abc" } });

    expect(screen.getByRole("searchbox")).toHaveProperty("value", "abc");
  });
});
