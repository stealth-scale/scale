import { type ReactElement, useState } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { recipe } from "#textarea/recipe.ts";
import { Textarea, type TextareaProps } from "#textarea/textarea.tsx";

/**
 * Renders a textarea whose value the caller holds.
 */
function Driven(): ReactElement {
  const [held, setHeld] = useState("");

  return <Textarea aria-label="Notes" onValueChange={setHeld} value={held} />;
}

describe("Textarea", () => {
  it("returns no accessibility violation when named with aria-label", async () => {
    await expect(
      accessibilityViolations(Textarea, { props: { "aria-label": "Notes" } }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(
        recipe,
        (props: TextareaProps) => render(<Textarea aria-label="Notes" {...props} />).container,
        { slot: "root" },
      ),
    ).toStrictEqual([]);
  });

  it("renders a textarea inside the root", () => {
    const { container } = render(<Textarea aria-label="Notes" />);

    expect(slotElement(container, "textarea", "control").tagName).toBe("TEXTAREA");
  });

  it("defaults rows to 3", () => {
    render(<Textarea aria-label="Notes" />);

    expect(screen.getByRole("textbox").getAttribute("rows")).toBe("3");
  });

  it("copies the value onto the root when grows is set", () => {
    const { container } = render(<Textarea aria-label="Notes" defaultValue="two lines" grows />);

    expect(slotElement(container, "textarea", "root").dataset["value"]).toBe("two lines");
  });

  it("writes no copy onto the root when grows is unset", () => {
    const { container } = render(<Textarea aria-label="Notes" defaultValue="two lines" />);

    expect(slotElement(container, "textarea", "root").dataset["value"]).toBeUndefined();
  });

  it("updates the copy on every change when grows is set", () => {
    const { container } = render(<Textarea aria-label="Notes" grows />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "a line" } });

    expect(slotElement(container, "textarea", "root").dataset["value"]).toBe("a line");
  });

  it("writes the row limit onto the root of a growing field", () => {
    const { container } = render(<Textarea aria-label="Notes" grows maxRows={6} />);
    const root = slotElement(container, "textarea", "root");

    expect(root.dataset["capped"]).toBe("");
    expect(root.style.getPropertyValue("--textarea-max-rows")).toBe("6");
  });

  it("holds the row limit at rows when maxRows is smaller", () => {
    const { container } = render(<Textarea aria-label="Notes" grows maxRows={2} rows={4} />);

    expect(
      slotElement(container, "textarea", "root").style.getPropertyValue("--textarea-max-rows"),
    ).toBe("4");
  });

  it("writes no row limit onto the root of a field that does not grow", () => {
    const { container } = render(<Textarea aria-label="Notes" maxRows={6} />);
    const root = slotElement(container, "textarea", "root");

    expect(root.dataset["capped"]).toBeUndefined();
    expect(root.style.getPropertyValue("--textarea-max-rows")).toBe("");
  });

  it("applies className to the box", () => {
    const { container } = render(<Textarea aria-label="Notes" className="placed" />);

    expect(slotElement(container, "textarea", "root").classList.contains("placed")).toBe(true);
  });

  it("calls the onChange the caller passes on every change", () => {
    const changed = vi.fn<() => void>();

    render(<Textarea aria-label="Notes" onChange={changed} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "ab" } });

    expect(changed).toHaveBeenCalledOnce();
  });

  it("calls onValueChange with the new value on every change", () => {
    const told = vi.fn<(value: string) => void>();

    render(<Textarea aria-label="Notes" onValueChange={told} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "ab" } });

    expect(told).toHaveBeenLastCalledWith("ab");
  });

  it("renders the value its caller holds", () => {
    render(<Driven />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "abc" } });

    expect(screen.getByRole("textbox")).toHaveProperty("value", "abc");
  });
});
