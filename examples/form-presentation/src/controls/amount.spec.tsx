import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { Amount } from "#controls/amount.tsx";
import { Harness } from "#controls/harness.fixtures.tsx";

describe("Amount", () => {
  it("formats the number in the currency the options name", async () => {
    await drawn(
      <Harness
        draw={Amount}
        presentation={{ options: { currency: "EUR" } }}
        schema={{ type: "number" }}
      />,
    );

    expect(screen.getByRole<HTMLInputElement>("spinbutton", { name: "Amount" }).value).toBe(
      "€2.00",
    );
  });

  it("formats a plain number where the currency is not a string", async () => {
    await drawn(
      <Harness
        draw={Amount}
        presentation={{ options: { currency: 3 } }}
        schema={{ type: "number" }}
      />,
    );

    expect(screen.getByRole<HTMLInputElement>("spinbutton", { name: "Amount" }).value).toBe("2");
  });
});
