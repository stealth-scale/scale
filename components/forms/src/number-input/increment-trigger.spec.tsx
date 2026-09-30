import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { variantClass } from "@stealthscale/testing-theme";

import { IncrementTrigger } from "#number-input/increment-trigger.tsx";
import { Input } from "#number-input/input.tsx";
import { composed, framed } from "#number-input/number-input.fixtures.tsx";
import { Root } from "#number-input/root.tsx";

describe("IncrementTrigger", () => {
  it("renders a button named Increase value by default", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Increase value" }).tagName).toBe("BUTTON");
  });

  it("takes its name from label", async () => {
    await drawn(
      <Root>
        <Input aria-label="Seats" />
        <IncrementTrigger label="Add a seat" />
      </Root>,
    );

    expect(screen.getByRole("button", { name: "Add a seat" })).toBeDefined();
  });

  it("takes the button out of the tab order", async () => {
    await drawn(composed());

    expect(screen.getByRole("button", { name: "Increase value" }).tabIndex).toBe(-1);
  });

  it("points aria-controls at the input", async () => {
    await drawn(composed());

    expect(
      screen.getByRole("button", { name: "Increase value" }).getAttribute("aria-controls"),
    ).toBe(screen.getByRole("spinbutton").id);
  });

  it("renders the button inside an input group mark", async () => {
    await drawn(composed());

    expect(
      screen.getByRole("button", { name: "Increase value" }).parentElement?.className,
    ).toContain("input-group__mark");
  });

  it("steps the value up on a press", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("button", { name: "Increase value" }));
    await framed();

    expect(screen.getByRole<HTMLInputElement>("spinbutton").value).toBe("5");
  });

  it("disables the button at the maximum", async () => {
    await drawn(composed({ defaultValue: "50" }));

    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Increase value" }).disabled).toBe(
      true,
    );
  });

  it("disables the button in a read-only input", async () => {
    await drawn(composed({ readOnly: true }));

    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Increase value" }).disabled).toBe(
      true,
    );
  });

  it("takes the size of the root", async () => {
    await drawn(composed({ size: "xl" }));

    expect([...screen.getByRole("button", { name: "Increase value" }).classList]).toContain(
      variantClass("number-input", "size", "xl"),
    );
  });
});
