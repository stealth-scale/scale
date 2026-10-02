import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { tableOf } from "#data-table/data-table.fixtures.tsx";
import { GridContent } from "#data-table/grid-content.tsx";
import { Root } from "#data-table/root.tsx";

/**
 * Returns the props of an open text field.
 */
function opened(): Parameters<typeof GridContent>[0]["editor"] {
  return {
    editor: undefined,
    error: undefined,
    label: "Edit Amount",
    mode: "caret",
    onCancel: vi.fn<() => void>(),
    onCommit: vi.fn<(text: string) => void>(),
    size: "md",
    text: "700",
  };
}

describe("GridContent", () => {
  it("renders the content alone for a cell without an editor or a change", () => {
    const { container } = render(
      <Root table={tableOf()}>
        <GridContent editor={undefined} unsaved={undefined}>
          700
        </GridContent>
      </Root>,
    );

    expect(container.textContent).toBe("700");
  });

  it("renders the unsaved words after the content for assistive technology", () => {
    render(
      <Root table={tableOf()}>
        <GridContent editor={undefined} unsaved="Unsaved change">
          700
        </GridContent>
      </Root>,
    );

    expect(screen.getByText("Unsaved change").className).toContain("data-table__visually-hidden");
  });

  it("renders the editor over the content while it is open", () => {
    render(
      <Root table={tableOf()}>
        <GridContent editor={opened()} unsaved="Unsaved change">
          700
        </GridContent>
      </Root>,
    );

    expect([
      screen.getByRole("textbox", { name: "Edit Amount" }).tagName,
      screen.queryByText("Unsaved change"),
    ]).toStrictEqual(["INPUT", null]);
  });
});
