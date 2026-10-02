import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { recipeClass } from "@stealthscale/testing-theme";

import { Anchor } from "#pagination/anchor.tsx";

describe("Anchor", () => {
  it("renders an a with the button's class", async () => {
    await drawn(<Anchor href="#page-2">Two</Anchor>);

    expect(screen.getByRole("link", { name: "Two" }).classList).toContain(recipeClass("button"));
  });

  it("leaves the type attribute out", async () => {
    await drawn(<Anchor href="#page-2">Two</Anchor>);

    expect(screen.getByRole("link", { name: "Two" }).hasAttribute("type")).toBe(false);
  });
});
