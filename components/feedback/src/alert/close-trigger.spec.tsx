import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, pressed, violations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { alerted, composed } from "#alert/alert.fixtures.tsx";
import { CloseTrigger } from "#alert/close-trigger.tsx";
import { recipe } from "#alert/recipe.ts";
import { type RootProps } from "#alert/root.tsx";

describe("CloseTrigger", () => {
  it("conforms as a button element inside the root", () => {
    expect(
      violations(CloseTrigger, {
        as: true,
        children: true,
        element: "BUTTON",
        subject: (container) => slotElement(container, "alert", "closeTrigger"),
        wrapper: alerted,
      }),
    ).toStrictEqual([]);
  });

  it("returns no accessibility violation", async () => {
    await expect(
      accessibilityViolations(CloseTrigger, { props: { children: "x" }, wrapper: alerted }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every variant value set on the root", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "closeTrigger",
      }),
    ).toStrictEqual([]);
  });

  it("defaults its accessible name to Dismiss", () => {
    render(alerted(<CloseTrigger>x</CloseTrigger>));

    expect(screen.getByRole("button", { name: "Dismiss" })).toBeDefined();
  });

  it("takes its accessible name from label", () => {
    render(alerted(<CloseTrigger label="Dismiss payment failed">x</CloseTrigger>));

    expect(screen.getByRole("button", { name: "Dismiss payment failed" })).toBeDefined();
  });

  it("sets type to button", () => {
    render(alerted(<CloseTrigger>x</CloseTrigger>));

    expect(screen.getByRole("button", { name: "Dismiss" }).getAttribute("type")).toBe("button");
  });

  it("calls onClick when pressed", async () => {
    let presses = 0;

    render(
      alerted(
        <CloseTrigger
          onClick={() => {
            presses += 1;
          }}
        >
          x
        </CloseTrigger>,
      ),
    );
    await pressed(screen.getByRole("button", { name: "Dismiss" }));

    expect(presses).toBe(1);
  });
});
