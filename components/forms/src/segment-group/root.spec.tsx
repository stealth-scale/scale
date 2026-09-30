import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { recipe } from "#segment-group/recipe.ts";
import { type RootProps } from "#segment-group/root.tsx";
import { composed, pressed } from "#segment-group/segment-group.fixtures.tsx";

const MEASURED = ["--left", "--top", "--width", "--height"] as const;

function measured(): void {
  vi.spyOn(HTMLElement.prototype, "offsetLeft", "get").mockReturnValue(2);
  vi.spyOn(HTMLElement.prototype, "offsetTop", "get").mockReturnValue(3);
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(80);
  vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(34);
}

describe("Root", () => {
  it("returns no accessibility violation for a named group", async () => {
    await expect(
      accessibilityViolations(() => composed({ "aria-label": "Period" })),
    ).resolves.toStrictEqual([]);
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

  it("renders a div in the radiogroup role", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "segment-group", "root").getAttribute("role")).toBe("radiogroup");
  });

  it("lays its items in a row when orientation is absent", async () => {
    await drawn(composed());

    expect(screen.getByRole("radiogroup").getAttribute("aria-orientation")).toBe("horizontal");
  });

  it("stacks its items when orientation is vertical", async () => {
    await drawn(composed({ orientation: "vertical" }));

    expect(screen.getByRole("radiogroup").getAttribute("aria-orientation")).toBe("vertical");
  });

  it("takes its name from an aria-label the caller passes", async () => {
    await drawn(composed({ "aria-label": "Period" }));

    expect(screen.getByRole("radiogroup", { name: "Period" })).toBeDefined();
  });

  it("sets no aria-labelledby outside a field or a fieldset", async () => {
    await drawn(composed());

    expect(screen.getByRole("radiogroup").getAttribute("aria-labelledby")).toBeNull();
  });

  it("takes its name from the label of the field around it", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Period</Field.Label>
        {composed()}
      </Field.Root>,
    );

    expect(screen.getByRole("radiogroup", { name: "Period" })).toBeDefined();
  });

  it("takes its name from the legend of the fieldset around it", async () => {
    await drawn(
      <Fieldset.Root>
        <Fieldset.Legend>Period</Fieldset.Legend>
        {composed()}
      </Fieldset.Root>,
    );

    expect(screen.getByRole("radiogroup", { name: "Period" })).toBeDefined();
  });

  it("lists the field's helper and error texts in aria-describedby", async () => {
    await drawn(
      <Field.Root id="period">
        {composed()}
        <Field.HelperText>Totals reset at midnight.</Field.HelperText>
      </Field.Root>,
    );

    expect(
      screen.getByRole("radiogroup").getAttribute("aria-describedby")?.split(" "),
    ).toStrictEqual(["period-helper", "period-error"]);
  });

  it("renders the thumb as its first child", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "segment-group", "root").firstElementChild).toBe(
      slotElement(container, "segment-group", "indicator"),
    );
  });

  it("hides the thumb from assistive technology", async () => {
    const { container } = await drawn(composed({ defaultValue: "Month" }));

    expect(slotElement(container, "segment-group", "indicator").getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("writes the checked item's offset box into the thumb's custom properties", async () => {
    measured();

    const { container } = await drawn(composed({ defaultValue: "Month" }));
    const thumb = slotElement(container, "segment-group", "indicator");

    expect(MEASURED.map((name) => thumb.style.getPropertyValue(name))).toStrictEqual([
      "2px",
      "3px",
      "80px",
      "34px",
    ]);
  });

  it("shows the thumb once the checked item is measured", async () => {
    measured();

    const { container } = await drawn(composed({ defaultValue: "Month" }));

    expect(slotElement(container, "segment-group", "indicator").hidden).toBe(false);
  });

  it("hides the thumb while no option is checked", async () => {
    measured();

    const { container } = await drawn(composed({ defaultValue: null }));

    expect(slotElement(container, "segment-group", "indicator").hidden).toBe(true);
  });

  it("checks the option a person presses", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("radio", { name: "Quarter" }));

    expect(screen.getByRole<HTMLInputElement>("radio", { name: "Quarter" }).checked).toBe(true);
  });

  it("calls onValueChange with the value of the option a person presses", async () => {
    const heard = vi.fn<(details: { value: null | string }) => void>();

    await drawn(composed({ onValueChange: heard }));
    await pressed(screen.getByRole("radio", { name: "Week" }));

    expect(heard).toHaveBeenCalledWith({ value: "Week" });
  });

  it("gives every input the name the caller passes", async () => {
    await drawn(composed({ name: "period" }));

    expect(screen.getAllByRole<HTMLInputElement>("radio").map((radio) => radio.name)).toStrictEqual(
      ["period", "period", "period"],
    );
  });

  it("takes the size of the field around it", async () => {
    const { container } = await drawn(<Field.Root size="lg">{composed()}</Field.Root>);

    expect([...slotElement(container, "segment-group", "item").classList]).toContain(
      variantClass("segment-group__item", "size", "lg"),
    );
  });

  it("keeps its own size over the field's", async () => {
    const { container } = await drawn(
      <Field.Root size="lg">{composed({ size: "xs" })}</Field.Root>,
    );

    expect([...slotElement(container, "segment-group", "item").classList]).toContain(
      variantClass("segment-group__item", "size", "xs"),
    );
  });

  it("takes the disabled state of the fieldset around it", async () => {
    await drawn(<Fieldset.Root disabled>{composed()}</Fieldset.Root>);

    expect(screen.getAllByRole<HTMLInputElement>("radio").every((radio) => radio.disabled)).toBe(
      true,
    );
  });
});
