import { within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { opened } from "#app.fixtures.tsx";

describe("Sections", () => {
  it("draws the brand and the link to the catalogue as items of the row", async () => {
    const result = await opened("/components/actions/button");
    const row = result.getByRole("toolbar", { name: "Docs" });

    expect(within(row).getByRole("link", { name: "Stealth Scale" }).tabIndex).toBe(-1);
    expect(within(row).getByRole("link", { name: "Components" }).tabIndex).toBe(-1);
  });

  it("stands the two an extra large gap apart in a row of their own", async () => {
    const result = await opened("/components/actions/button");
    const row = result.getByRole("toolbar", { name: "Docs" });
    const brand = within(row).getByRole("link", { name: "Stealth Scale" });
    const section = within(row).getByRole("link", { name: "Components" });

    expect(brand.parentElement).toBe(section.parentElement);
    expect(brand.parentElement?.classList.contains("stack--xl")).toBe(true);
  });
});
