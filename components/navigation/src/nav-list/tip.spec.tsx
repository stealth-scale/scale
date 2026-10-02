import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Tooltip } from "@stealthscale/component-disclosure";
import { drawn } from "@stealthscale/testing-react";

import { Tip } from "#nav-list/tip.tsx";

describe("Tip", () => {
  it("renders an a element with its target", async () => {
    await drawn(
      <Tooltip.Root>
        <Tip href="/invoices">Invoices</Tip>
      </Tooltip.Root>,
    );

    expect(screen.getByRole("link", { name: "Invoices" }).getAttribute("href")).toBe("/invoices");
  });

  it("applies the tooltip's trigger props", async () => {
    await drawn(
      <Tooltip.Root>
        <Tip href="/invoices">Invoices</Tip>
      </Tooltip.Root>,
    );

    expect(screen.getByRole("link").dataset["part"]).toBe("trigger");
  });
});
