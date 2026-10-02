import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import * as Fieldset from "#fieldset/index.ts";
import { composed } from "#radio-card/radio-card.fixtures.tsx";
import { recipe } from "#radio-card/recipe.ts";
import { type RootProps } from "#radio-card/root.tsx";
import { pressed } from "#radio-group/radio-group.fixtures.tsx";

describe("Root", () => {
  it("returns no accessibility violation for a labelled set", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(composed(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders a div in the radiogroup role named by its label", async () => {
    await drawn(composed());

    expect(screen.getByRole("radiogroup", { name: "Delivery speed" }).tagName).toBe("DIV");
  });

  it("names each radio after its card's title", async () => {
    await drawn(composed());

    expect(screen.getAllByRole("radio").map((radio) => radio.getAttribute("value"))).toStrictEqual([
      "Standard",
      "Next day",
      "Same day",
    ]);
  });

  it("checks the card a person presses", async () => {
    await drawn(composed());
    await pressed(screen.getByText("Leaves overnight."));

    expect(screen.getByRole<HTMLInputElement>("radio", { name: "Next day" }).checked).toBe(true);
  });

  it("calls onValueChange with the value of the card a person presses", async () => {
    const heard = vi.fn<(details: { value: null | string }) => void>();

    await drawn(composed({ onValueChange: heard }));
    await pressed(screen.getByRole("radio", { name: "Same day" }));

    expect(heard).toHaveBeenCalledWith({ value: "Same day" });
  });

  it("sets aria-orientation from orientation", async () => {
    await drawn(composed({ orientation: "horizontal" }));

    expect(screen.getByRole("radiogroup").getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("takes the size of the fieldset around it", async () => {
    const { container } = await drawn(<Fieldset.Root size="lg">{composed()}</Fieldset.Root>);

    expect([...slotElement(container, "radio-card", "root").classList]).toContain(
      variantClass("radio-card__root", "size", "lg"),
    );
  });

  it("keeps its own size over the fieldset's", async () => {
    const { container } = await drawn(
      <Fieldset.Root size="lg">{composed({ size: "sm" })}</Fieldset.Root>,
    );

    expect([...slotElement(container, "radio-card", "root").classList]).toContain(
      variantClass("radio-card__root", "size", "sm"),
    );
  });
});
