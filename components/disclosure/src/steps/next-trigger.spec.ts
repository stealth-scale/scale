import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { composed } from "#steps/steps.fixtures.tsx";

describe("NextTrigger", () => {
  it("renders a button", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Next" }).tagName).toBe("BUTTON");
  });

  it("moves to the next step on a press", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByRole("button", { name: "Current: Amount" })).toBeTruthy();
  });

  it("sets aria-disabled once the flow is completed", async () => {
    await drawn(composed({ defaultStep: 3 }));

    expect(screen.getByRole("button", { name: "Next" }).getAttribute("aria-disabled")).toBe("true");
  });

  it("leaves the disabled attribute out once the flow is completed", async () => {
    await drawn(composed({ defaultStep: 3 }));

    expect(screen.getByRole("button", { name: "Next" }).hasAttribute("disabled")).toBe(false);
  });

  it("leaves aria-disabled out while a step is left", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Next" }).hasAttribute("aria-disabled")).toBe(false);
  });

  it("keeps the completed flow completed on a press", async () => {
    await drawn(composed({ defaultStep: 3 }));
    await pressed(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Done").hidden).toBe(false);
  });
});
