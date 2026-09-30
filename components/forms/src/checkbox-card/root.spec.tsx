import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { card, pressed } from "#checkbox-card/checkbox-card.fixtures.tsx";
import { recipe } from "#checkbox-card/recipe.ts";
import { type RootProps } from "#checkbox-card/root.tsx";
import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";

describe("Root", () => {
  it("returns no accessibility violation for a card", async () => {
    await expect(accessibilityViolations(() => card())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(card(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders a label around the card", async () => {
    const { container } = await drawn(card());

    expect(slotElement(container, "checkbox-card", "root").tagName).toBe("LABEL");
  });

  it("names the input by the card's title", async () => {
    await drawn(card());

    expect(screen.getByRole("checkbox", { name: "Email" })).toBeDefined();
  });

  it("lists the description and the addon in aria-describedby", async () => {
    await drawn(card());

    expect(screen.getByRole("checkbox").getAttribute("aria-describedby")?.split(" ")).toStrictEqual(
      [screen.getByText("A summary every morning.").id, screen.getByText("Free").id],
    );
  });

  it("sets no aria-describedby on a card without a description or an addon", async () => {
    await drawn(card({}, { added: false, described: false }));

    expect(screen.getByRole("checkbox").getAttribute("aria-describedby")).toBeNull();
  });

  it("lists the field's texts before the card's own", async () => {
    await drawn(<Field.Root id="updates">{card({}, { added: false })}</Field.Root>);

    expect(
      screen.getByRole("checkbox").getAttribute("aria-describedby")?.split(" ").slice(0, 2),
    ).toStrictEqual(["updates-helper", "updates-error"]);
  });

  it("checks the card on a press on its title", async () => {
    await drawn(card());
    await pressed(screen.getByText("Email"));

    expect(screen.getByRole<HTMLInputElement>("checkbox").checked).toBe(true);
  });

  it("restores the input when the owner of a controlled card refuses a press", async () => {
    await drawn(card({ checked: false }));
    await pressed(screen.getByText("Email"));

    expect(screen.getByRole<HTMLInputElement>("checkbox").checked).toBe(false);
  });

  it("calls the caller's onClick on a press of the card", async () => {
    const heard = vi.fn<() => void>();

    await drawn(card({ onClick: heard }));
    await pressed(screen.getByText("Email"));

    expect(heard).toHaveBeenCalled();
  });

  it("calls onCheckedChange with the state a press sets", async () => {
    const heard = vi.fn<(details: { checked: "indeterminate" | boolean }) => void>();

    await drawn(card({ onCheckedChange: heard }));
    await pressed(screen.getByText("Free"));

    expect(heard).toHaveBeenCalledWith({ checked: true });
  });

  it("sets the input's indeterminate property on a partly-on card", async () => {
    await drawn(card({ defaultChecked: "indeterminate" }));

    expect(screen.getByRole<HTMLInputElement>("checkbox").indeterminate).toBe(true);
  });

  it("takes the invalid state of the field around it", async () => {
    await drawn(<Field.Root invalid>{card()}</Field.Root>);

    expect(screen.getByRole("checkbox").getAttribute("aria-invalid")).toBe("true");
  });

  it("takes the disabled state of the fieldset around it", async () => {
    await drawn(<Fieldset.Root disabled>{card()}</Fieldset.Root>);

    expect(screen.getByRole<HTMLInputElement>("checkbox").disabled).toBe(true);
  });

  it("takes the size of the field around it", async () => {
    const { container } = await drawn(<Field.Root size="lg">{card()}</Field.Root>);

    expect([...slotElement(container, "checkbox-card", "content").classList]).toContain(
      variantClass("checkbox-card__content", "size", "lg"),
    );
  });

  it("keeps its own size over the field's", async () => {
    const { container } = await drawn(<Field.Root size="lg">{card({ size: "sm" })}</Field.Root>);

    expect([...slotElement(container, "checkbox-card", "content").classList]).toContain(
      variantClass("checkbox-card__content", "size", "sm"),
    );
  });
});
