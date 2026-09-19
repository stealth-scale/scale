import { type ComponentProps, createRef, type ReactElement, type ReactNode } from "react";

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Item } from "#roving-focus/item.tsx";
import { recipe } from "#roving-focus/recipe.ts";
import { Root } from "#roving-focus/root.tsx";

function grouped(children: ReactNode): ReactElement {
  return <Root>{children}</Root>;
}

function Owned(props: ComponentProps<"button">): ReactElement {
  return <button {...props} id="menu" />;
}

describe("Item", () => {
  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(
        recipe,
        (props) =>
          render(
            <Root {...props}>
              <Item>One</Item>
            </Root>,
          ).container,
        { slot: "item" },
      ),
    ).toStrictEqual([]);
  });

  it("answers to the id a caller states", () => {
    const { container } = render(grouped(<Item id="cut">Cut</Item>));

    expect(slotElement(container, "roving-focus", "item").getAttribute("id")).toBe("cut");
  });

  it("writes no id on the element where a caller states none", () => {
    const { container } = render(grouped(<Item>Cut</Item>));

    expect(slotElement(container, "roving-focus", "item").getAttribute("id")).toBeNull();
  });

  it("keeps the id a control drawn as the item writes for itself", () => {
    const { container } = render(grouped(<Item as={Owned}>Cut</Item>));

    expect(slotElement(container, "roving-focus", "item").getAttribute("id")).toBe("menu");
  });

  it("tells a screen reader that a disabled item is disabled", () => {
    const { getByText } = render(grouped(<Item disabled>Cut</Item>));

    expect(getByText("Cut").getAttribute("aria-disabled")).toBe("true");
    expect(getByText("Cut").dataset["disabled"]).toBe("");
  });

  it("marks the item that holds the tab stop", () => {
    const { getByText } = render(grouped(<Item id="cut">Cut</Item>));

    expect(getByText("Cut").dataset["active"]).toBe("");
  });

  it("hands the element to a caller holding a reference", () => {
    const held = createRef<HTMLDivElement>();

    render(grouped(<Item ref={held}>Cut</Item>));

    expect(held.current?.textContent).toBe("Cut");
  });

  it("hands the element to a caller taking it in a callback", () => {
    const seen: Array<HTMLElement | null> = [];

    render(
      grouped(
        <Item
          ref={(node) => {
            seen.push(node);
          }}
        >
          Cut
        </Item>,
      ),
    );

    expect(seen.at(-1)?.textContent).toBe("Cut");
  });

  it("draws the element as names", () => {
    const { container } = render(grouped(<Item as="button">Cut</Item>));

    expect(slotElement(container, "roving-focus", "item").tagName).toBe("BUTTON");
  });

  it("throws when it is drawn outside a group", () => {
    expect(() => render(<Item>Cut</Item>)).toThrow(
      "RovingFocus.Item is drawn inside RovingFocus.Root and nowhere else.",
    );
  });
});
