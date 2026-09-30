import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { card, pressed } from "#checkbox-card/checkbox-card.fixtures.tsx";

describe("Description", () => {
  it("renders a span", async () => {
    await drawn(card());

    expect(screen.getByText("A summary every morning.").tagName).toBe("SPAN");
  });

  it("sets data-state to checked once the card is checked", async () => {
    await drawn(card());
    await pressed(screen.getByText("Email"));

    expect(screen.getByText("A summary every morning.").dataset["state"]).toBe("checked");
  });

  it("sets data-state to indeterminate on a partly-on card", async () => {
    await drawn(card({ defaultChecked: "indeterminate" }));

    expect(screen.getByText("A summary every morning.").dataset["state"]).toBe("indeterminate");
  });

  it("sets data-disabled on a disabled card", async () => {
    await drawn(card({ disabled: true }));

    expect(screen.getByText("A summary every morning.").dataset["disabled"]).toBe("true");
  });
});
