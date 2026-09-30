import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, pressed, settled } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { day, inlined, OCTOBER_14, opened, picked } from "#date-picker/date-picker.fixtures.tsx";
import { type RootProps, type ValueChangeDetails } from "#date-picker/index.ts";
import { recipe } from "#date-picker/recipe.ts";
import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";

describe("Root", () => {
  it("returns no accessibility violation for a labelled date picker", async () => {
    await expect(accessibilityViolations(() => picked())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation while the panel is open", async () => {
    await expect(
      accessibilityViolations(() => picked({ defaultOpen: true }), { frame: true }),
    ).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation for an inline calendar", async () => {
    await expect(accessibilityViolations(() => inlined())).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(picked(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders a div", async () => {
    const { container } = await drawn(picked());

    expect(slotElement(container, "date-picker", "root").tagName).toBe("DIV");
  });

  it("renders no panel before it first opens", async () => {
    await drawn(picked());

    expect(screen.queryByRole("dialog", { hidden: true })).toBeNull();
  });

  it("applies the palette's class to the panel", async () => {
    const { container } = await drawn(inlined({ palette: "accent" }));

    expect([...slotElement(container, "date-picker", "content").classList]).toContain(
      variantClass("date-picker__content", "palette", "accent"),
    );
  });

  it("calls onValueChange with a pressed day", async () => {
    const changed = vi.fn<(details: ValueChangeDetails) => void>();

    await drawn(picked({ onValueChange: changed }));
    await opened();
    await pressed(day("Tuesday, October 20, 2026"));
    await settled();

    expect(changed.mock.lastCall?.[0].value.map(String)).toStrictEqual(["2026-10-20"]);
  });

  it("names the days in its locale", async () => {
    await drawn(inlined({ locale: "de-DE" }));

    expect(day("Mittwoch, 14. Oktober 2026")).toBeDefined();
  });

  it("takes the size of the field around it", async () => {
    const { container } = await drawn(<Field.Root size="lg">{picked()}</Field.Root>);

    expect([...slotElement(container, "date-picker", "input").classList]).toContain(
      variantClass("date-picker__input", "size", "lg"),
    );
  });

  it("keeps its own size over the field's", async () => {
    const { container } = await drawn(<Field.Root size="lg">{picked({ size: "sm" })}</Field.Root>);

    expect([...slotElement(container, "date-picker", "input").classList]).toContain(
      variantClass("date-picker__input", "size", "sm"),
    );
  });

  it("takes the disabled state of the fieldset around it", async () => {
    await drawn(<Fieldset.Root disabled>{picked()}</Fieldset.Root>);

    expect(screen.getByRole("textbox").hasAttribute("disabled")).toBe(true);
  });

  it("takes the invalid state of the field around it", async () => {
    await drawn(<Field.Root invalid>{picked()}</Field.Root>);

    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
  });

  it("takes the read-only state of the field around it", async () => {
    await drawn(<Field.Root readOnly>{picked()}</Field.Root>);

    expect(screen.getByRole("textbox").hasAttribute("readonly")).toBe(true);
  });

  it("takes the required state of the field around it", async () => {
    await drawn(<Field.Root required>{picked()}</Field.Root>);

    expect(screen.getByRole("textbox").getAttribute("aria-required")).toBe("true");
  });

  it("names the input by the field's label", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Visit</Field.Label>
        {picked({ defaultValue: [OCTOBER_14] }, { label: null })}
      </Field.Root>,
    );

    expect(screen.getByRole("textbox", { name: "Visit" })).toBeDefined();
  });
});
