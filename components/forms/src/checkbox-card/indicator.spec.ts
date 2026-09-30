import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { card, pressed } from "#checkbox-card/checkbox-card.fixtures.tsx";

describe("Indicator", () => {
  it("hides both marks on an unchecked card", async () => {
    await drawn(card());

    expect(
      [screen.getByTestId("check"), screen.getByTestId("dash")].map(
        (mark) => mark.parentElement?.hidden,
      ),
    ).toStrictEqual([true, true]);
  });

  it("shows the checked mark once the card is checked", async () => {
    await drawn(card());
    await pressed(screen.getByText("Email"));

    expect(screen.getByTestId("check").parentElement?.hidden).toBe(false);
  });

  it("shows the partly-on mark on a partly-on card", async () => {
    await drawn(card({ defaultChecked: "indeterminate" }));

    expect(
      [screen.getByTestId("check"), screen.getByTestId("dash")].map(
        (mark) => mark.parentElement?.hidden,
      ),
    ).toStrictEqual([true, false]);
  });
});
