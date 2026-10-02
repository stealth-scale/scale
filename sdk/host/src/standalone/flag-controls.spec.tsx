import { fireEvent, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { opened, panelOf, settled } from "#standalone/workbench.fixtures.tsx";

describe("FlagControls", () => {
  it("turns a boolean flag off from its switch", async () => {
    const page = await opened();

    await settled(() => {
      fireEvent.click(within(panelOf(page)).getByRole("switch", { name: "time-off/calendar" }));
    });

    expect(page.host.stores.flags.read("time-off/calendar")).toBe(false);
  });

  it("serves the variant a person picks for an experiment", async () => {
    const page = await opened();

    await settled(() => {
      fireEvent.change(within(panelOf(page)).getByRole("combobox", { name: "time-off/layout" }), {
        target: { value: "board" },
      });
    });

    expect(page.host.stores.flags.read("time-off/layout")).toBe("board");
  });

  it("renders the page's select glyph beside an experiment's picker", async () => {
    const page = await opened({
      glyphs: { select: { indicator: <span>chevron</span>, selected: null } },
    });
    const field = within(panelOf(page)).getByRole("combobox", { name: "time-off/layout" });

    expect(field.parentElement?.textContent).toContain("chevron");
  });
});
