import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn, pressed, settled } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import { hiddenOf, opened, picker } from "#color-picker/color-picker.fixtures.tsx";
import { type ValueChangeDetails } from "#color-picker/machine.ts";
import { recipe } from "#color-picker/recipe.ts";
import { type RootProps } from "#color-picker/root.tsx";
import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";

describe("Root", () => {
  it("returns no accessibility violation for a labelled color picker", async () => {
    await expect(accessibilityViolations(() => picker())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation while the panel is open", async () => {
    await expect(
      accessibilityViolations(() => picker({ defaultOpen: true }), { frame: true }),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: Partial<RootProps>) => (await drawn(picker(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders a div", async () => {
    const { container } = await drawn(picker());

    expect(slotElement(container, "color-picker", "root").tagName).toBe("DIV");
  });

  it("renders the hidden input as its last child", async () => {
    const { container } = await drawn(picker());

    expect(slotElement(container, "color-picker", "root").lastElementChild).toBe(
      hiddenOf(container),
    );
  });

  it("renders no panel before it first opens", async () => {
    await drawn(picker());

    expect(screen.queryByRole("dialog", { hidden: true })).toBeNull();
  });

  it("renders the panel once it opens", async () => {
    await drawn(picker());
    await opened();

    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("parses a color passed as a string", async () => {
    const { container } = await drawn(picker({ defaultValue: "hsl(0, 100%, 50%)" }));

    expect(hiddenOf(container).value).toBe("hsla(0, 100%, 50%, 1)");
  });

  it("calls onValueChange with the color of a pressed swatch", async () => {
    const changed = vi.fn<(details: ValueChangeDetails) => void>();

    await drawn(picker({ onValueChange: changed }));
    await opened();
    await pressed(screen.getByRole("button", { name: "Red" }));
    await settled();

    expect(changed.mock.lastCall?.[0].valueAsString).toBe("rgba(220, 38, 38, 1)");
  });

  it("formats the thumbs' values in its locale", async () => {
    await drawn(picker({ locale: "de-DE" }));
    await opened();

    expect(screen.getByRole("slider", { name: "Alpha" }).getAttribute("aria-valuetext")).toBe(
      "100 %",
    );
  });

  it("takes the size of the field around it", async () => {
    const { container } = await drawn(<Field.Root size="lg">{picker()}</Field.Root>);

    expect([...slotElement(container, "color-picker", "trigger").classList]).toContain(
      variantClass("color-picker__trigger", "size", "lg"),
    );
  });

  it("keeps its own size over the field's", async () => {
    const { container } = await drawn(<Field.Root size="lg">{picker({ size: "sm" })}</Field.Root>);

    expect([...slotElement(container, "color-picker", "trigger").classList]).toContain(
      variantClass("color-picker__trigger", "size", "sm"),
    );
  });

  it("takes the disabled state of the fieldset around it", async () => {
    await drawn(<Fieldset.Root disabled>{picker()}</Fieldset.Root>);

    expect(screen.getByRole("textbox").hasAttribute("disabled")).toBe(true);
  });

  it("takes the required state of the field around it", async () => {
    await drawn(<Field.Root required>{picker()}</Field.Root>);

    expect(screen.getByRole("textbox").getAttribute("aria-required")).toBe("true");
  });

  it("takes the invalid state of the field around it", async () => {
    await drawn(<Field.Root invalid>{picker()}</Field.Root>);

    expect(screen.getByRole("textbox").getAttribute("aria-invalid")).toBe("true");
  });

  it("takes the read-only state of the field around it", async () => {
    await drawn(<Field.Root readOnly>{picker()}</Field.Root>);

    expect(screen.getByRole("textbox").hasAttribute("readonly")).toBe(true);
  });

  it("names the hex input by the field's label", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Accent</Field.Label>
        {picker({}, { labelled: false })}
      </Field.Root>,
    );

    expect(screen.getByRole("textbox", { name: "Accent" })).toBeDefined();
  });

  it("describes the hex input by the field's helper text", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Accent</Field.Label>
        {picker({}, { labelled: false })}
        <Field.HelperText>Buttons take it.</Field.HelperText>
      </Field.Root>,
    );

    expect(screen.getByRole("textbox").getAttribute("aria-describedby")).toContain(
      screen.getByText("Buttons take it.").id,
    );
  });
});
