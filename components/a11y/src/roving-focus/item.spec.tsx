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
  it("emits a class for every variant value the recipe declares", () => {
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

  it("writes the id attribute when the caller supplies one", () => {
    const { container } = render(grouped(<Item id="cut">Cut</Item>));

    expect(slotElement(container, "roving-focus", "item").getAttribute("id")).toBe("cut");
  });

  it("writes no id attribute when the caller supplies none", () => {
    const { container } = render(grouped(<Item>Cut</Item>));

    expect(slotElement(container, "roving-focus", "item").getAttribute("id")).toBeNull();
  });

  it("leaves the id set by a component rendered through as", () => {
    const { container } = render(grouped(<Item as={Owned}>Cut</Item>));

    expect(slotElement(container, "roving-focus", "item").getAttribute("id")).toBe("menu");
  });

  it("sets aria-disabled on a disabled item", () => {
    const { getByText } = render(grouped(<Item disabled>Cut</Item>));

    expect(getByText("Cut").getAttribute("aria-disabled")).toBe("true");
  });

  it("sets data-disabled on a disabled item", () => {
    const { getByText } = render(grouped(<Item disabled>Cut</Item>));

    expect(getByText("Cut").dataset["disabled"]).toBe("");
  });

  it("sets data-stop on the item holding the tab stop", () => {
    const { getByText } = render(grouped(<Item id="cut">Cut</Item>));

    expect(getByText("Cut").dataset["stop"]).toBe("");
  });

  it("assigns the element to a ref object", () => {
    const held = createRef<HTMLDivElement>();

    render(grouped(<Item ref={held}>Cut</Item>));

    expect(held.current?.textContent).toBe("Cut");
  });

  it("calls a ref callback with the element", () => {
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

  it("renders the item slot as button when as is button", () => {
    const { container } = render(grouped(<Item as="button">Cut</Item>));

    expect(slotElement(container, "roving-focus", "item").tagName).toBe("BUTTON");
  });

  it("throws when rendered outside a root", () => {
    expect(() => render(<Item>Cut</Item>)).toThrow(
      "RovingFocus.Item is drawn inside RovingFocus.Root and nowhere else.",
    );
  });
});
