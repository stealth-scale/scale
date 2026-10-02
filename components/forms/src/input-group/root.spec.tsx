import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { Addon } from "#input-group/addon.tsx";
import { Field } from "#input-group/field.ts";
import { composed, grouped, stacked } from "#input-group/input-group.fixtures.tsx";
import { Mark } from "#input-group/mark.ts";
import { recipe } from "#input-group/recipe.ts";
import { Root, type RootProps } from "#input-group/root.tsx";

/**
 * Places an element's box across a horizontal span, 40 pixels high at the top of the page.
 */
function placed(element: Element, left: number, right: number): void {
  Object.defineProperty(element, "getBoundingClientRect", {
    value: () => new DOMRect(left, 0, right - left, 40),
  });
}

/**
 * Renders a country select in a start addon with a chevron mark after it, before a phone field.
 */
function phone(): ReturnType<typeof render> {
  return render(
    grouped(
      <>
        <Addon>
          <Field aria-label="Country" as="select">
            <option>NL</option>
          </Field>
          <Mark aria-hidden>▾</Mark>
        </Addon>
        <Field aria-label="Phone" />
      </>,
    ),
  );
}

describe("Root", () => {
  it("returns no accessibility violation for a named field between two marks", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("renders a div with no role", () => {
    const { container } = render(composed());
    const root = slotElement(container, "input-group", "root");

    expect(root.tagName).toBe("DIV");
    expect(root.hasAttribute("role")).toBe(false);
  });

  it("focuses the field when a mark before it is pressed", () => {
    render(composed());
    fireEvent.mouseDown(screen.getByText("€"));

    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Amount" }));
  });

  it("focuses the field when a mark after it is pressed", () => {
    render(composed());
    fireEvent.mouseDown(screen.getByText("EUR"));

    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Amount" }));
  });

  it("focuses the field nearest the pointer when the box's padding is pressed", () => {
    const { container } = render(
      grouped(
        <>
          <Field aria-label="Month" size={2} />
          <Field aria-label="Code" />
        </>,
      ),
    );

    placed(screen.getByRole("textbox", { name: "Month" }), 10, 50);
    placed(screen.getByRole("textbox", { name: "Code" }), 60, 200);
    fireEvent.mouseDown(slotElement(container, "input-group", "root"), {
      clientX: 205,
      clientY: 20,
    });

    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Code" }));
  });

  it("keeps the earlier field when the pointer is nearer to it", () => {
    const { container } = render(
      grouped(
        <>
          <Field aria-label="Month" size={2} />
          <Field aria-label="Code" />
        </>,
      ),
    );

    placed(screen.getByRole("textbox", { name: "Month" }), 10, 50);
    placed(screen.getByRole("textbox", { name: "Code" }), 60, 200);
    fireEvent.mouseDown(slotElement(container, "input-group", "root"), {
      clientX: 4,
      clientY: 20,
    });

    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Month" }));
  });

  it("focuses the later of two fields at the same distance from the pointer", () => {
    render(
      grouped(
        <>
          <Field aria-label="Month" size={2} />
          <Mark aria-hidden>/</Mark>
          <Field aria-label="Year" size={2} />
        </>,
      ),
    );
    fireEvent.mouseDown(screen.getByText("/"));

    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Year" }));
  });

  it("keeps a press on a row to the fields of that row", () => {
    const { container } = render(stacked());

    fireEvent.mouseDown(slotElement(container, "input-group", "row"));

    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Card number" }));
  });

  it("keeps a press on a mark inside an addon to the addon's select", () => {
    phone();
    fireEvent.mouseDown(screen.getByText("▾"));

    expect(document.activeElement).toBe(screen.getByRole("combobox", { name: "Country" }));
  });

  it("skips a disabled field", () => {
    render(
      grouped(
        <>
          <Mark aria-hidden>€</Mark>
          <Field aria-label="Locked" disabled />
          <Field aria-label="Open" />
        </>,
      ),
    );
    fireEvent.mouseDown(screen.getByText("€"));

    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Open" }));
  });

  it("leaves focus alone when the group has no enabled field", () => {
    render(
      grouped(
        <>
          <Mark aria-hidden>€</Mark>
          <Field aria-label="Locked" disabled />
        </>,
      ),
    );
    fireEvent.mouseDown(screen.getByText("€"));

    expect(document.activeElement).toBe(document.body);
  });

  it("leaves focus alone when the only enabled field is outside the group", () => {
    render(
      <>
        {grouped(
          <>
            <Mark aria-hidden>€</Mark>
            <Field aria-label="Locked" disabled />
          </>,
        )}
        <input aria-label="Outside" />
      </>,
    );
    fireEvent.mouseDown(screen.getByText("€"));

    expect(document.activeElement).toBe(document.body);
  });

  it("leaves a press on a button in a mark to the button", () => {
    render(
      grouped(
        <>
          <Field aria-label="Passphrase" />
          <Mark>
            <button type="button">Show</button>
          </Mark>
        </>,
      ),
    );
    fireEvent.mouseDown(screen.getByRole("button", { name: "Show" }));

    expect(document.activeElement).toBe(document.body);
  });

  it("focuses the nearest field when the group sits inside a label", () => {
    render(
      // eslint-disable-next-line jsx-a11y/label-has-associated-control -- the case renders the group inside a label on purpose
      <label>{composed()}</label>,
    );
    fireEvent.mouseDown(screen.getByText("€"));

    expect(document.activeElement).toBe(screen.getByRole("textbox", { name: "Amount" }));
  });

  it("ignores a press with a button other than the primary one", () => {
    render(composed());
    fireEvent.mouseDown(screen.getByText("€"), { button: 2 });

    expect(document.activeElement).toBe(document.body);
  });

  it("calls onMouseDown before it moves focus", () => {
    const pressed = vi.fn<() => void>();

    render(
      <Root onMouseDown={pressed}>
        <Mark aria-hidden>€</Mark>
        <Field aria-label="Amount" />
      </Root>,
    );
    fireEvent.mouseDown(screen.getByText("€"));

    expect(pressed).toHaveBeenCalledOnce();
  });

  it("leaves focus alone when onMouseDown prevents the default", () => {
    render(
      <Root
        onMouseDown={(event) => {
          event.preventDefault();
        }}
      >
        <Mark aria-hidden>€</Mark>
        <Field aria-label="Amount" />
      </Root>,
    );
    fireEvent.mouseDown(screen.getByText("€"));

    expect(document.activeElement).toBe(document.body);
  });

  it("opens the list of a select pressed through its mark", () => {
    const shown = vi.fn<() => void>();

    phone();
    Object.defineProperty(screen.getByRole("combobox", { name: "Country" }), "showPicker", {
      value: shown,
    });
    fireEvent.mouseDown(screen.getByText("▾"));

    expect(shown).toHaveBeenCalledOnce();
  });

  it("focuses a select whose browser refuses to open its list", () => {
    phone();
    Object.defineProperty(screen.getByRole("combobox", { name: "Country" }), "showPicker", {
      value: () => {
        throw new DOMException("Refused", "NotAllowedError");
      },
    });
    fireEvent.mouseDown(screen.getByText("▾"));

    expect(document.activeElement).toBe(screen.getByRole("combobox", { name: "Country" }));
  });
});
