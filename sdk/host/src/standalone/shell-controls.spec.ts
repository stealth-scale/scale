import { fireEvent, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { type Opened, opened, panelOf, settled } from "#standalone/workbench.fixtures.tsx";

async function changed(page: Opened, name: string, value: string): Promise<HTMLSelectElement> {
  const field = within(panelOf(page)).getByRole<HTMLSelectElement>("combobox", { name });

  await settled(() => {
    fireEvent.change(field, { target: { value } });
  });

  return within(panelOf(page)).getByRole<HTMLSelectElement>("combobox", { name });
}

describe("ShellControls", () => {
  it("sets the locale a person picks", async () => {
    const page = await opened({ locales: ["en", "de"] });

    expect((await changed(page, "Language", "de")).value).toBe("de");
  });

  it("offers no language picker for one locale", async () => {
    const page = await opened();

    expect(within(panelOf(page)).queryByRole("combobox", { name: "Language" })).toBeNull();
  });

  it("sets the theme a person picks", async () => {
    const page = await opened({ themes: ["ink", "pine"] });

    expect((await changed(page, "Theme", "pine")).value).toBe("pine");
  });

  it("shows the first theme before a person picks one", async () => {
    const page = await opened({ themes: ["ink", "pine"] });

    expect(
      within(panelOf(page)).getByRole<HTMLSelectElement>("combobox", { name: "Theme" }).value,
    ).toBe("ink");
  });

  it("offers no theme picker for one theme", async () => {
    const page = await opened();

    expect(within(panelOf(page)).queryByRole("combobox", { name: "Theme" })).toBeNull();
  });

  it("sets the color mode a person picks", async () => {
    const page = await opened();

    await settled(() => {
      fireEvent.click(within(panelOf(page)).getByRole("radio", { name: "Dark" }));
    });

    expect(
      within(panelOf(page)).getByRole<HTMLInputElement>("radio", { name: "Dark" }).checked,
    ).toBe(true);
  });
});
