import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Presentation, type Schema } from "@stealthscale/provider-form";
import { drawn } from "@stealthscale/testing-react";
import { slotClass } from "@stealthscale/testing-theme";

import { generated } from "#form/form.fixtures.tsx";

const NAME: Schema = {
  properties: { email: { type: "string" }, first: { type: "string" }, last: { type: "string" } },
  type: "object",
};

const GRID: Presentation<Record<string, unknown>> = {
  fields: { email: { span: 2 } },
  id: "profile",
  of: [{ columns: 2, of: ["first", "last", "email"] }],
};

/**
 * Selects the elements with the form's cell class.
 */
const CELL = `.${slotClass("form", "cell")}`;

describe("Cell", () => {
  it("renders a spanned field inside a cell that spans its columns", async () => {
    const { container } = await drawn(generated(NAME, { presentation: GRID }));
    const cell = container.querySelector<HTMLElement>(CELL);

    expect(cell?.style.getPropertyValue("--form-span")).toBe("2");
  });

  it("renders the spanned field inside its cell", async () => {
    await drawn(generated(NAME, { presentation: GRID }));

    expect(screen.getByRole("textbox", { name: "Email" }).closest(CELL)).not.toBeNull();
  });

  it("renders a field without a span as its own grid item", async () => {
    await drawn(generated(NAME, { presentation: GRID }));

    expect(screen.getByRole("textbox", { name: "First" }).closest(CELL)).toBeNull();
  });
});
