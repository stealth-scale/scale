import { type ReactElement, useState } from "react";

import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Item } from "#roving-focus/item.tsx";
import { Root, type RootProps } from "#roving-focus/root.tsx";

/**
 * Renders a toolbar of three items, optionally disabling the middle one.
 */
function group(props: { middle?: boolean } & Partial<RootProps> = {}): RootProps["children"] {
  const { middle = false, ...rest } = props;

  return (
    <Root role="toolbar" {...rest}>
      <Item id="one">One</Item>
      <Item disabled={middle} id="two">
        Two
      </Item>
      <Item id="three">Three</Item>
    </Root>
  );
}

/**
 * Renders a toolbar whose first item only mounts once a button is clicked, so it registers after
 * the items that follow it in the document.
 */
function Late(): ReactElement {
  const [first, setFirst] = useState(false);

  return (
    <Root role="toolbar">
      {first ? <Item id="one">One</Item> : undefined}
      <Item id="two">Two</Item>
      <Item id="three">Three</Item>
      <button
        onClick={() => {
          setFirst(true);
        }}
        type="button"
      >
        Add
      </button>
    </Root>
  );
}

describe("useRovingFocus", () => {
  it("sets tabIndex to 0 on the first item and -1 on the rest", () => {
    const { getByText } = render(group());

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
    expect(getByText("Two").getAttribute("tabindex")).toBe("-1");
    expect(getByText("Three").getAttribute("tabindex")).toBe("-1");
  });

  it("moves the tab stop to the next item on ArrowRight", () => {
    const { getByText } = render(group());

    fireEvent.keyDown(getByText("One"), { key: "ArrowRight" });

    expect(getByText("Two").getAttribute("tabindex")).toBe("0");
    expect(getByText("One").getAttribute("tabindex")).toBe("-1");
  });

  it("moves the tab stop to the previous item on ArrowLeft", () => {
    const { getByText } = render(group());

    fireEvent.keyDown(getByText("One"), { key: "ArrowRight" });
    fireEvent.keyDown(getByText("Two"), { key: "ArrowLeft" });

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("ignores ArrowDown when the orientation is horizontal", () => {
    const { getByText } = render(group());

    fireEvent.keyDown(getByText("One"), { key: "ArrowDown" });

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("moves the tab stop on ArrowDown when the orientation is vertical", () => {
    const { getByText } = render(group({ orientation: "vertical" }));

    fireEvent.keyDown(getByText("One"), { key: "ArrowDown" });

    expect(getByText("Two").getAttribute("tabindex")).toBe("0");
  });

  it("moves the tab stop on ArrowDown when the orientation is both", () => {
    const { getByText } = render(group({ orientation: "both" }));

    fireEvent.keyDown(getByText("One"), { key: "ArrowDown" });

    expect(getByText("Two").getAttribute("tabindex")).toBe("0");
  });

  it("holds the tab stop on the last item on ArrowRight when wrap is false", () => {
    const { getByText } = render(group());

    fireEvent.keyDown(getByText("One"), { key: "End" });
    fireEvent.keyDown(getByText("Three"), { key: "ArrowRight" });

    expect(getByText("Three").getAttribute("tabindex")).toBe("0");
  });

  it("returns the tab stop to the first item on ArrowRight when wrap is true", () => {
    const { getByText } = render(group({ wrap: true }));

    fireEvent.keyDown(getByText("One"), { key: "End" });
    fireEvent.keyDown(getByText("Three"), { key: "ArrowRight" });

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("moves the tab stop to the last item on End", () => {
    const { getByText } = render(group());

    fireEvent.keyDown(getByText("One"), { key: "End" });

    expect(getByText("Three").getAttribute("tabindex")).toBe("0");
  });

  it("moves the tab stop to the first item on Home", () => {
    const { getByText } = render(group());

    fireEvent.keyDown(getByText("One"), { key: "End" });
    fireEvent.keyDown(getByText("Three"), { key: "Home" });

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("steps over a disabled item when moving the tab stop", () => {
    const { getByText } = render(group({ middle: true }));

    fireEvent.keyDown(getByText("One"), { key: "ArrowRight" });

    expect(getByText("Three").getAttribute("tabindex")).toBe("0");
    expect(getByText("Two").getAttribute("tabindex")).toBe("-1");
  });

  it("leaves the tab stop where it is on Enter", () => {
    const { getByText } = render(group());

    fireEvent.keyDown(getByText("One"), { key: "Enter" });

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("ignores ArrowRight when the orientation is vertical", () => {
    const { getByText } = render(group({ orientation: "vertical" }));

    fireEvent.keyDown(getByText("One"), { key: "ArrowRight" });

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("moves the tab stop to the next item on ArrowLeft when the direction is rtl", () => {
    const { getByText } = render(group({ style: { direction: "rtl" } }));

    fireEvent.keyDown(getByText("One"), { key: "ArrowLeft" });

    expect(getByText("Two").getAttribute("tabindex")).toBe("0");
  });

  it("leaves the tab stop where it is when a modifier is held with the arrow", () => {
    const { getByText } = render(group());

    fireEvent.keyDown(getByText("One"), { ctrlKey: true, key: "ArrowRight" });

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("ignores an arrow whose target lies outside every registered item", () => {
    const { getByRole, getByText } = render(group());

    fireEvent.keyDown(getByRole("toolbar"), { key: "ArrowRight" });

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("moves the tab stop to an item that receives focus", () => {
    const { getByText } = render(group());

    fireEvent.focus(getByText("Three"));

    expect(getByText("Three").getAttribute("tabindex")).toBe("0");
  });

  it("leaves the tab stop where it is when a disabled item receives focus", () => {
    const { getByText } = render(group({ middle: true }));

    fireEvent.focus(getByText("Two"));

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("calls onActiveIdChange with the id of the item taking the stop", () => {
    const moved: Array<string | undefined> = [];
    const { getByText } = render(
      group({
        onActiveIdChange: (activeId) => {
          moved.push(activeId);
        },
      }),
    );

    fireEvent.keyDown(getByText("One"), { key: "ArrowRight" });

    expect(moved).toContain("two");
  });

  it("orders items by document position when one registers after the items below it", () => {
    const { getByText } = render(<Late />);

    fireEvent.click(getByText("Add"));
    fireEvent.keyDown(getByText("Two"), { key: "Home" });

    expect(getByText("One").getAttribute("tabindex")).toBe("0");
  });

  it("steps from the first item when activeId names no registered item", () => {
    const { getByText } = render(group({ activeId: "gone" }));

    fireEvent.keyDown(getByText("One"), { key: "ArrowRight" });

    expect(document.activeElement).toBe(getByText("Two"));
  });

  it("keeps the tab stop on the item activeId names when the caller controls it", () => {
    const { getByText } = render(group({ activeId: "three" }));

    fireEvent.keyDown(getByText("Three"), { key: "Home" });

    expect(getByText("Three").getAttribute("tabindex")).toBe("0");
  });
});
