import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { slotElement, variantClass } from "@stealthscale/testing-theme";

import { narrowed } from "#app-shell/app-shell.fixtures.tsx";
import { Action } from "#toolbar/action.tsx";
import { ranged } from "#toolbar/toolbar.fixtures.tsx";

/**
 * Renders an empty `svg` in place of an icon.
 */
const ICON = <svg aria-hidden="true" />;

describe("Action", () => {
  it("renders a button", () => {
    const { container } = render(ranged(<Action primary>Filter</Action>));

    expect(slotElement(container, "toolbar", "action").tagName).toBe("BUTTON");
  });

  it("takes the row's roving tab stop", () => {
    render(ranged(<Action primary>Filter</Action>));

    expect(screen.getByRole("button").tabIndex).toBe(0);
  });

  it("leaves one tab stop in a row of several actions", () => {
    render(
      ranged(
        <>
          <Action primary>Filter</Action>
          <Action icon={ICON}>Export</Action>
          <Action>Columns</Action>
        </>,
      ),
    );

    expect(screen.getAllByRole("button").filter((each) => each.tabIndex === 0)).toHaveLength(1);
  });

  it("sets data-priority to tertiary for an action without an icon", () => {
    render(ranged(<Action>Columns</Action>));

    expect(screen.getByRole("button").dataset["priority"]).toBe("tertiary");
  });

  it("sets data-priority to secondary for an action with an icon", () => {
    render(ranged(<Action icon={ICON}>Export</Action>));

    expect(screen.getByRole("button").dataset["priority"]).toBe("secondary");
  });

  it("sets data-priority to its stated priority", () => {
    render(
      ranged(
        <Action icon={ICON} priority="primary">
          Filter
        </Action>,
      ),
    );

    expect(screen.getByRole("button").dataset["priority"]).toBe("primary");
  });

  it("renders ghost when not primary", () => {
    render(ranged(<Action icon={ICON}>Export</Action>));

    expect(screen.getByRole("button").classList).toContain(
      variantClass("button", "variant", "ghost"),
    );
  });

  it("renders solid when primary", () => {
    render(ranged(<Action primary>Filter</Action>));

    expect(screen.getByRole("button").classList).toContain(
      variantClass("button", "variant", "solid"),
    );
  });

  it("renders at the toolbar's size", () => {
    render(ranged(<Action primary>Filter</Action>, { size: "sm" }));

    expect(screen.getByRole("button").classList).toContain(variantClass("button", "size", "sm"));
  });

  it("wraps the words after an icon in a span", () => {
    render(ranged(<Action icon={ICON}>Export</Action>));

    expect(screen.getByText("Export").tagName).toBe("SPAN");
  });

  it("renders nothing for a tertiary action on a narrow row", () => {
    render(narrowed(ranged(<Action>Columns</Action>)));

    expect(screen.queryByRole("button", { name: "Columns" })).toBeNull();
  });

  it("keeps a secondary action on a narrow row", () => {
    render(narrowed(ranged(<Action icon={ICON}>Export</Action>)));

    expect(screen.getByRole("button", { name: "Export" })).toBeTruthy();
  });

  it("writes data-narrow on a narrow row", () => {
    render(narrowed(ranged(<Action icon={ICON}>Export</Action>)));

    expect(screen.getByRole("button").dataset["narrow"]).toBe("");
  });

  it("omits data-narrow on a wide row", () => {
    render(ranged(<Action icon={ICON}>Export</Action>));

    expect(screen.getByRole("button").dataset["narrow"]).toBeUndefined();
  });

  it("sets aria-disabled while disabled", () => {
    render(
      ranged(
        <Action disabled primary>
          Filter
        </Action>,
      ),
    );

    expect(screen.getByRole("button").getAttribute("aria-disabled")).toBe("true");
  });

  it("calls no onClick while disabled", () => {
    const onClick = vi.fn<() => void>();

    render(
      ranged(
        <Action disabled onClick={onClick} primary>
          Filter
        </Action>,
      ),
    );
    screen.getByRole("button").click();

    expect(onClick).not.toHaveBeenCalled();
  });

  it("calls onClick when pressed", () => {
    const onClick = vi.fn<() => void>();

    render(
      ranged(
        <Action onClick={onClick} primary>
          Filter
        </Action>,
      ),
    );
    screen.getByRole("button").click();

    expect(onClick).toHaveBeenCalledOnce();
  });
});
