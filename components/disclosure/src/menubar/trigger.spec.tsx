import { screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { bar, named } from "#menubar/menubar.fixtures.tsx";

describe("Trigger", () => {
  it("renders every name as a menuitem of the bar", async () => {
    await drawn(bar());

    expect(
      within(screen.getByRole("menubar"))
        .getAllByRole("menuitem")
        .map((name) => name.textContent),
    ).toStrictEqual(["File", "Edit", "View"]);
  });

  it("gives the first name the bar's tab stop", async () => {
    await drawn(bar());

    expect([named("File").tabIndex, named("Edit").tabIndex, named("View").tabIndex]).toStrictEqual([
      0, -1, -1,
    ]);
  });

  it("applies the menubar's trigger class to a name", async () => {
    await drawn(bar());

    expect(named("File").className).toContain("menubar__trigger");
  });

  it("renders a row that opens its menu in the folded bar's menu", async () => {
    await drawn(bar());
    await pressed(screen.getByRole("button", { name: "Menu" }));

    expect(
      within(screen.getByRole("menu"))
        .getByRole("menuitem", { name: "File" })
        .getAttribute("aria-haspopup"),
    ).toBe("menu");
  });

  it("ends a folded row with the root's foldIndicator", async () => {
    await drawn(bar({ foldIndicator: <span data-testid="chevron">›</span> }));
    await pressed(screen.getByRole("button", { name: "Menu" }));

    expect(within(screen.getByRole("menu")).getAllByTestId("chevron")).toHaveLength(3);
  });

  it("renders a folded row without an indicator when the root has no foldIndicator", async () => {
    await drawn(bar());
    await pressed(screen.getByRole("button", { name: "Menu" }));

    expect(screen.getByRole("menu").querySelector(".menu__indicator")).toBeNull();
  });
});
