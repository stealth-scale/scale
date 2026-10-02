import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Presentation, type Schema } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";
import { slotClass } from "@stealthscale/testing-theme";

import { generated, GLYPHS } from "#form/form.fixtures.tsx";

const PERSON: Schema = {
  properties: { first: { type: "string" }, last: { type: "string" }, note: { type: "string" } },
  type: "object",
};

const LINES: Schema = {
  properties: {
    lines: { items: { properties: { amount: { type: "number" } }, type: "object" }, type: "array" },
  },
  type: "object",
};

const REPEATED: Presentation<Record<string, unknown>> = {
  id: "profile",
  of: [{ of: ["lines[].amount"], repeat: "lines" }],
};

/**
 * Returns the form's group elements.
 */
function groups(container: HTMLElement): HTMLElement[] {
  return [...container.querySelectorAll<HTMLElement>(`.${slotClass("form", "group")}`)];
}

/**
 * Renders the person in the one group the presentation states.
 */
async function grouped(group: Presentation<Record<string, unknown>>["of"]): Promise<HTMLElement> {
  const { container } = await drawn(
    generated(PERSON, { presentation: { id: "profile", of: group } }),
  );

  return container;
}

describe("Group", () => {
  it("renders a group with a legend as a fieldset named by the legend", async () => {
    await grouped([{ legend: true, name: "who", of: ["first", "last"] }]);

    expect(screen.getByRole("group", { name: "Who" }).tagName).toBe("FIELDSET");
  });

  it("renders a closed group as a disclosure under its legend", async () => {
    const container = await grouped([{ closed: true, legend: true, name: "more", of: ["note"] }]);

    expect([
      container.querySelector("details")?.open,
      container.querySelector("summary")?.textContent,
    ]).toStrictEqual([false, "More"]);
  });

  it("shows the form's disclosure glyph in a closed group's summary", async () => {
    const { container } = await drawn(
      generated(PERSON, {
        glyphs: GLYPHS,
        presentation: {
          id: "profile",
          of: [{ closed: true, legend: true, name: "more", of: ["note"] }],
        },
      }),
    );

    expect(container.querySelector("summary [data-glyph=disclosure]")).not.toBeNull();
  });

  it("gives a group with a legend the form's section class", async () => {
    await grouped([{ legend: true, name: "who", of: ["first", "last"] }]);

    expect(screen.getByRole("group", { name: "Who" }).className).toContain(
      slotClass("form", "section"),
    );
  });

  it("gives a closed group the form's section class", async () => {
    const container = await grouped([{ closed: true, legend: true, name: "more", of: ["note"] }]);

    expect(container.querySelector("details")?.className).toContain(slotClass("form", "section"));
  });

  it("renders a closed group in the plain look of the disclosure", async () => {
    const container = await grouped([{ closed: true, legend: true, name: "more", of: ["note"] }]);

    expect(container.querySelector("details")?.className).toContain("details__root--plain");
  });

  it("renders a group without a legend as its members alone", async () => {
    const container = await grouped([{ of: ["first", "last"] }]);

    expect(container.querySelector("fieldset")).toBeNull();
  });

  it("lays the members out in the count of columns the group states", async () => {
    const container = await grouped([{ columns: 2, of: ["first", "last"] }]);

    expect(groups(container)[0]?.style.getPropertyValue("--form-columns")).toBe("2");
  });

  it("lays the members out across the page where the group states a row", async () => {
    const container = await grouped([{ direction: "row", of: ["first", "last"] }]);

    expect(groups(container)[0]?.dataset["direction"]).toBe("row");
  });

  it("renders a button that adds an item to a repeat group", async () => {
    await drawn(generated(LINES, { presentation: REPEATED }));
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    await settled();

    expect(screen.getAllByRole("spinbutton", { name: "Amount" })).toHaveLength(1);
  });

  it("moves focus to the add button once the last item is removed", async () => {
    await drawn(generated(LINES, { presentation: REPEATED }));
    fireEvent.click(screen.getByRole("button", { name: "Add" }));
    await settled();
    fireEvent.click(screen.getByRole("button", { name: "Remove item 1" }));
    await settled();
    await act(async () => {
      await Promise.resolve();
    });

    expect(document.activeElement).toBe(screen.getByRole("button", { name: "Add" }));
  });
});
