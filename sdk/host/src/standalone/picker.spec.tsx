import { fireEvent, render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Picker } from "#standalone/picker.tsx";

const CHOICES = [
  { label: "List", value: "list" },
  { label: "Board", value: "board" },
];

function ignored(): void {}

function partsBeside(container: HTMLElement): number | undefined {
  return within(container).getByRole("combobox").parentElement?.childElementCount;
}

describe("Picker", () => {
  it("names the select by its words", () => {
    const view = render(
      <Picker choices={CHOICES} label="Layout" onValueChange={ignored} value="list" />,
    );

    expect(within(view.container).getByRole("combobox", { name: "Layout" })).toBeTruthy();
  });

  it("lists every choice in order", () => {
    const view = render(
      <Picker choices={CHOICES} label="Layout" onValueChange={ignored} value="list" />,
    );

    expect(
      within(view.container)
        .getAllByRole("option")
        .map((option) => option.textContent),
    ).toStrictEqual(["List", "Board"]);
  });

  it("passes the value a person picks", () => {
    const picked = vi.fn<(value: string) => void>();
    const view = render(
      <Picker choices={CHOICES} label="Layout" onValueChange={picked} value="list" />,
    );

    fireEvent.change(within(view.container).getByRole("combobox"), {
      target: { value: "board" },
    });

    expect(picked).toHaveBeenCalledExactlyOnceWith("board");
  });

  it("renders the glyph beside the select", () => {
    const view = render(
      <Picker
        choices={CHOICES}
        indicator={<span>chevron</span>}
        label="Layout"
        onValueChange={ignored}
        value="list"
      />,
    );

    expect([partsBeside(view.container), view.container.textContent]).toStrictEqual([
      2,
      "LayoutListBoardchevron",
    ]);
  });

  it("renders no glyph where none is given", () => {
    const view = render(
      <Picker choices={CHOICES} label="Layout" onValueChange={ignored} value="list" />,
    );

    expect(partsBeside(view.container)).toBe(1);
  });
});
