import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Input } from "#listbox/input.tsx";
import { offered } from "#listbox/listbox.fixtures.tsx";

/**
 * Changes the field's value.
 */
function typed(value: string): void {
  fireEvent.change(screen.getByRole("textbox"), { target: { value } });
}

describe("Input", () => {
  it("renders an input", () => {
    const { container } = render(offered(<Input aria-label="Filter places" />));

    expect(slotElement(container, "listbox", "input").tagName).toBe("INPUT");
  });

  it("renders the field inside the control div", () => {
    const { container } = render(offered(<Input aria-label="Filter places" />));

    expect(slotElement(container, "listbox", "control").tagName).toBe("DIV");
  });

  it("sets aria-haspopup to listbox", () => {
    render(offered(<Input aria-label="Filter places" />));

    expect(screen.getByRole("textbox").getAttribute("aria-haspopup")).toBe("listbox");
  });

  it("sets aria-controls", () => {
    render(offered(<Input aria-label="Filter places" />));

    expect(screen.getByRole("textbox").getAttribute("aria-controls")).toBeTruthy();
  });

  it("renders no clear control while the field is empty", () => {
    render(offered(<Input aria-label="Filter places" clearIndicator="x" />));

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders no clear control without clearIndicator", async () => {
    await drawn(offered(<Input aria-label="Filter places" />));
    typed("pe");

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders the clear control while the field has text", async () => {
    await drawn(offered(<Input aria-label="Filter places" clearIndicator="x" />));
    typed("pe");

    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("names the clear control from clearLabel", async () => {
    await drawn(
      offered(<Input aria-label="Filter" clearIndicator="x" clearLabel="Clear the filter" />),
    );
    typed("pe");

    expect(screen.getByRole("button", { name: "Clear the filter" })).toBeTruthy();
  });

  it("clears the field on a press of the clear control", async () => {
    await drawn(offered(<Input aria-label="Filter places" clearIndicator="x" />));
    typed("pe");
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole<HTMLInputElement>("textbox").value).toBe("");
  });

  it("focuses the field after a press of the clear control", async () => {
    await drawn(offered(<Input aria-label="Filter places" clearIndicator="x" />));
    typed("pe");
    await pressed(screen.getByRole("button"));

    expect(document.activeElement).toBe(screen.getByRole("textbox"));
  });

  it("calls onValueChange with the typed text", async () => {
    const heard: string[] = [];

    await drawn(
      offered(
        <Input
          aria-label="Filter places"
          onValueChange={(value) => {
            heard.push(value);
          }}
        />,
      ),
    );
    typed("pe");

    expect(heard).toStrictEqual(["pe"]);
  });

  it("renders the value of a controlled field", () => {
    render(offered(<Input aria-label="Filter places" value="quartz" />));

    expect(screen.getByRole<HTMLInputElement>("textbox").value).toBe("quartz");
  });
});
