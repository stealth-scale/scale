import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { variantClass } from "@stealthscale/testing-theme";

import { DecrementTrigger } from "#number-input/decrement-trigger.tsx";
import { Input } from "#number-input/input.tsx";
import { composed, framed } from "#number-input/number-input.fixtures.tsx";
import { Root } from "#number-input/root.tsx";

describe("DecrementTrigger", () => {
  it("renders a button named Decrease value by default", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Decrease value" }).tagName).toBe("BUTTON");
  });

  it("takes its name from label", async () => {
    await drawn(
      <Root>
        <DecrementTrigger label="Remove a seat" />
        <Input aria-label="Seats" />
      </Root>,
    );

    expect(screen.getByRole("button", { name: "Remove a seat" })).toBeDefined();
  });

  it("takes the button out of the tab order", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Decrease value" }).tabIndex).toBe(-1);
  });

  it("points aria-controls at the input", async () => {
    await drawn(composed());

    expect(
      screen.getByRole("button", { name: "Decrease value" }).getAttribute("aria-controls"),
    ).toBe(screen.getByRole("spinbutton").id);
  });

  it("renders the button inside an input group mark", async () => {
    await drawn(composed());

    expect(
      screen.getByRole("button", { name: "Decrease value" }).parentElement?.className,
    ).toContain("input-group__mark");
  });

  it("steps the value down on a press", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("button", { name: "Decrease value" }));
    await framed();

    expect(screen.getByRole<HTMLInputElement>("spinbutton").value).toBe("3");
  });

  it("disables the button at the minimum", async () => {
    await drawn(composed({ defaultValue: "1" }));

    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Decrease value" }).disabled).toBe(
      true,
    );
  });

  it("disables the button in a disabled input", async () => {
    await drawn(composed({ disabled: true }));

    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Decrease value" }).disabled).toBe(
      true,
    );
  });

  it("takes the size of the root", async () => {
    await drawn(composed({ size: "xs" }));

    expect([...screen.getByRole("button", { name: "Decrease value" }).classList]).toContain(
      variantClass("number-input", "size", "xs"),
    );
  });
});
