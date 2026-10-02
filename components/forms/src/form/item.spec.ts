import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Presentation, type Schema } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";

import { generated } from "#form/form.fixtures.tsx";

const LINES: Schema = {
  properties: {
    lines: { items: { properties: { amount: { type: "number" } }, type: "object" }, type: "array" },
  },
  type: "object",
};

const ONE_AT_LEAST: Schema = {
  properties: {
    lines: {
      items: { properties: { amount: { type: "number" } }, type: "object" },
      minItems: 1,
      type: "array",
    },
  },
  type: "object",
};

const REPEATED: Presentation<Record<string, unknown>> = {
  id: "profile",
  of: [{ of: ["lines[].amount"], repeat: "lines" }],
};

/**
 * Adds an item to the repeat group.
 */
async function added(): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: "Add" }));
  await settled();
}

describe("Item", () => {
  it("names each remove button after the number of its item", async () => {
    await drawn(generated(LINES, { presentation: REPEATED }));
    await added();
    await added();

    expect(
      screen
        .getAllByRole("button", { name: /^Remove item/u })
        .map((button) => button.getAttribute("aria-label")),
    ).toStrictEqual(["Remove item 1", "Remove item 2"]);
  });

  it("shows Remove on each remove button", async () => {
    await drawn(generated(LINES, { presentation: REPEATED }));
    await added();

    expect(screen.getByRole("button", { name: "Remove item 1" }).textContent).toBe("Remove");
  });

  it("removes its item", async () => {
    await drawn(generated(LINES, { presentation: REPEATED }));
    await added();
    await added();
    fireEvent.click(screen.getByRole("button", { name: "Remove item 1" }));
    await settled();

    expect(screen.getAllByRole("spinbutton", { name: "Amount" })).toHaveLength(1);
  });

  it("renders no remove button while the array has no more items than it requires", async () => {
    await drawn(
      generated(ONE_AT_LEAST, { presentation: REPEATED, values: { lines: [{ amount: 1 }] } }),
    );

    expect(screen.queryByRole("button", { name: "Remove item 1" })).toBeNull();
  });

  it("moves focus into an item once a person adds it", async () => {
    await drawn(generated(LINES, { presentation: REPEATED }));
    await added();

    expect(document.activeElement).toBe(screen.getByRole("spinbutton", { name: "Amount" }));
  });
});
