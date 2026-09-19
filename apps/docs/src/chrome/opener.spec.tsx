import { describe, expect, it } from "vitest";

import { variantClass } from "@stealthscale/testing-theme";

import { opened } from "#app.fixtures.tsx";

describe("Opener", () => {
  it("draws the shell's trigger as the library's button", async () => {
    const result = await opened("/components/actions/button");

    expect(result.getByRole("button", { name: "Navigation" }).classList).toContain(
      variantClass("button", "variant", "ghost"),
    );
  });

  it("says which panel it opens and whether it is open", async () => {
    const result = await opened("/components/actions/button");
    const control = result.getByRole("button", { name: "Navigation" });

    expect(control.getAttribute("aria-expanded")).toBe("true");
    expect(control.getAttribute("aria-controls")).not.toBeNull();
  });

  it("draws the arrow that closes the navigation while it is open", async () => {
    const result = await opened("/components/actions/button");

    expect(
      result.getByRole("button", { name: "Navigation" }).querySelectorAll("path"),
    ).toHaveLength(2);
  });
});
