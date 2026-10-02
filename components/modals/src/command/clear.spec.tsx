import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Clear } from "#command/clear.tsx";
import { palette, pressed, typed } from "#command/command.fixtures.tsx";
import { Input } from "#command/input.tsx";

describe("Clear", () => {
  it("renders nothing while the field is empty", () => {
    render(palette(<Clear aria-label="Clear the query" />));

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders a button once a query is typed", async () => {
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

  it("sets type button", async () => {
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

  it("moves focus to the field", async () => {
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

  it("renders at mount when the palette opens with a query", () => {
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
