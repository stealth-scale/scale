import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Input } from "#listbox/input.tsx";
import { offered } from "#listbox/listbox.fixtures.tsx";

/**
 * Types into the field the way a person does.
 */
function typed(value: string): void {
  fireEvent.change(screen.getByRole("textbox"), { target: { value } });
}

describe("Input", () => {
  it("draws a field inside the root it needs above it", () => {
    const { container } = render(offered(<Input aria-label="Filter places" />));

    expect(slotElement(container, "listbox", "input").tagName).toBe("INPUT");
  });

  it("stands the field in a band, which is what carries the rule under it", () => {
    const { container } = render(offered(<Input aria-label="Filter places" />));

    expect(slotElement(container, "listbox", "control").tagName).toBe("DIV");
  });

  it("says it drives a listbox", () => {
    render(offered(<Input aria-label="Filter places" />));

    expect(screen.getByRole("textbox").getAttribute("aria-haspopup")).toBe("listbox");
  });

  it("names the list it drives", () => {
    render(offered(<Input aria-label="Filter places" />));

    expect(screen.getByRole("textbox").getAttribute("aria-controls")).toBeTruthy();
  });

  it("draws no control to empty the field while the field is empty", () => {
    render(offered(<Input aria-label="Filter places" clearIndicator="x" />));

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("draws no control where a caller hands it no mark to draw", async () => {
    await drawn(offered(<Input aria-label="Filter places" />));
    typed("pe");

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("draws the control once the field holds something", async () => {
    await drawn(offered(<Input aria-label="Filter places" clearIndicator="x" />));
    typed("pe");

    expect(screen.getByRole("button")).toBeTruthy();
  });

  it("names the control for a reader who cannot see the mark", async () => {
    await drawn(
      offered(<Input aria-label="Filter" clearIndicator="x" clearLabel="Clear the filter" />),
    );
    typed("pe");

    expect(screen.getByRole("button", { name: "Clear the filter" })).toBeTruthy();
  });

  it("empties the field when the control is pressed", async () => {
    await drawn(offered(<Input aria-label="Filter places" clearIndicator="x" />));
    typed("pe");
    await pressed(screen.getByRole("button"));

    expect(screen.getByRole<HTMLInputElement>("textbox").value).toBe("");
  });

  it("puts focus back in the field, because the next thing typed is another filter", async () => {
    await drawn(offered(<Input aria-label="Filter places" clearIndicator="x" />));
    typed("pe");
    await pressed(screen.getByRole("button"));

    expect(document.activeElement).toBe(screen.getByRole("textbox"));
  });

  it("reports what was typed, so a caller narrows the rows it hands back", async () => {
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

  it("follows the value a caller drives it with", () => {
    render(offered(<Input aria-label="Filter places" value="quartz" />));

    expect(screen.getByRole<HTMLInputElement>("textbox").value).toBe("quartz");
  });
});
