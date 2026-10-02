import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { composed } from "#steps/steps.fixtures.tsx";

describe("PrevTrigger", () => {
  it("renders a button", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Back" }).tagName).toBe("BUTTON");
  });

  it("moves to the previous step on a press", async () => {
    await drawn(composed({ defaultStep: 2 }));
    await pressed(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByRole("button", { name: "Current: Amount" })).toBeTruthy();
  });

  it("sets aria-disabled on the first step", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Back" }).getAttribute("aria-disabled")).toBe("true");
  });

  it("leaves the disabled attribute out on the first step", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Back" }).hasAttribute("disabled")).toBe(false);
  });

  it("leaves aria-disabled out after the first step", async () => {
    await drawn(composed({ defaultStep: 1 }));

    expect(screen.getByRole("button", { name: "Back" }).hasAttribute("aria-disabled")).toBe(false);
  });
});
