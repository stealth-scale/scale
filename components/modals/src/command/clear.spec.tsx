import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Clear } from "#command/clear.tsx";
import { palette, pressed, typed } from "#command/command.fixtures.tsx";
import { Input } from "#command/input.tsx";

describe("Clear", () => {
  it("stays out of the document while the field is empty", () => {
    render(palette(<Clear aria-label="Clear the query" />));

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders a button for the clear slot once something has been typed", async () => {
    const { container } = render(
      palette(
        <Input aria-label="Type a command">
          <Clear aria-label="Clear the query" />
        </Input>,
      ),
    );

    await typed(screen.getByRole("textbox"), "new");

    expect(slotElement(container, "command", "clear").tagName).toBe("BUTTON");
  });

  it("states a type so a palette inside a form does not submit it", async () => {
    const { container } = render(
      palette(
        <Input aria-label="Type a command">
          <Clear aria-label="Clear the query" />
        </Input>,
      ),
    );

    await typed(screen.getByRole("textbox"), "new");

    expect(slotElement(container, "command", "clear").getAttribute("type")).toBe("button");
  });

  it("empties the query when it is pressed", async () => {
    render(
      palette(
        <Input aria-label="Type a command">
          <Clear aria-label="Clear the query" />
        </Input>,
      ),
    );

    const field = screen.getByRole("textbox");

    await typed(field, "new");
    await pressed(screen.getByRole("button"));

    expect(field).toHaveProperty("value", "");
  });

  it("returns the reader to the field it emptied", async () => {
    render(
      palette(
        <Input aria-label="Type a command">
          <Clear aria-label="Clear the query" />
        </Input>,
      ),
    );

    const field = screen.getByRole("textbox");

    await typed(field, "new");
    await pressed(screen.getByRole("button"));

    expect(document.activeElement).toBe(field);
  });

  it("opens drawn where the palette was given a query to open on", () => {
    render(
      palette(
        <Input aria-label="Type a command">
          <Clear aria-label="Clear the query" />
        </Input>,
        { query: "new" },
      ),
    );

    expect(screen.getByRole("button")).toBeTruthy();
  });
});
