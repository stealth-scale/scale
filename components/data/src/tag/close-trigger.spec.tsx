import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { pressed } from "@stealthscale/testing-react";

import { CloseTrigger } from "#tag/close-trigger.ts";
import { composed, tagged } from "#tag/tag.fixtures.tsx";

describe("CloseTrigger", () => {
  it("renders a button named by its aria-label", () => {
    render(composed());

    expect(screen.getByRole("button", { name: "Remove payouts" })).toBeTruthy();
  });

  it("sets type to button when the caller passes none", () => {
    render(composed());

    expect(screen.getByRole("button", { name: "Remove payouts" }).getAttribute("type")).toBe(
      "button",
    );
  });

  it("calls onClick when pressed", async () => {
    let presses = 0;

    render(
      tagged(
        <CloseTrigger
          aria-label="Remove payouts"
          onClick={() => {
            presses += 1;
          }}
        >
          x
        </CloseTrigger>,
      ),
    );
    await pressed(screen.getByRole("button", { name: "Remove payouts" }));

    expect(presses).toBe(1);
  });
});
