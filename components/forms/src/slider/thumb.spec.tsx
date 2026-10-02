import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import * as Field from "#field/index.ts";
import { composed, focused, keyed, ranged, thumb } from "#slider/slider.fixtures.tsx";

describe("Thumb", () => {
  it("renders an element in the slider role named after the label", async () => {
    await drawn(composed());

    expect(thumb().tagName).toBe("DIV");
  });

  it("sets the value and its bounds as ARIA values", async () => {
    await drawn(composed());

    expect(
      ["aria-valuenow", "aria-valuemin", "aria-valuemax"].map((name) => thumb().getAttribute(name)),
    ).toStrictEqual(["40", "0", "100"]);
  });

  it("takes a place in the tab order", async () => {
    await drawn(composed());

    expect(thumb().tabIndex).toBe(0);
  });

  it("steps the value up on ArrowRight", async () => {
    await drawn(composed());
    await focused(thumb());
    await keyed(thumb(), "ArrowRight");

    expect(thumb().getAttribute("aria-valuenow")).toBe("41");
  });

  it("steps the value tenfold on PageUp", async () => {
    await drawn(composed());
    await focused(thumb());
    await keyed(thumb(), "PageUp");

    expect(thumb().getAttribute("aria-valuenow")).toBe("50");
  });

  it("sets the minimum on Home", async () => {
    await drawn(composed());
    await focused(thumb());
    await keyed(thumb(), "Home");

    expect(thumb().getAttribute("aria-valuenow")).toBe("0");
  });

  it("sets the formatted value as aria-valuetext", async () => {
    await drawn(composed({ formatOptions: { style: "unit", unit: "percent" }, locale: "en-GB" }));

    expect(thumb().getAttribute("aria-valuetext")).toBe("40%");
  });

  it("sets no aria-valuetext without formatOptions", async () => {
    await drawn(composed());

    expect(thumb().getAttribute("aria-valuetext")).toBeNull();
  });

  it("takes aria-valuetext from getAriaValueText over the format", async () => {
    await drawn(
      composed({
        formatOptions: { style: "unit", unit: "percent" },
        getAriaValueText: ({ value }) => `${String(value)} of 100`,
      }),
    );

    expect(thumb().getAttribute("aria-valuetext")).toBe("40 of 100");
  });

  it("names each thumb of a range after the label and its own words", async () => {
    await drawn(ranged());

    expect(
      screen.getAllByRole("slider").map((each) => each.getAttribute("aria-label")),
    ).toStrictEqual(["Minimum", "Maximum"]);
  });

  it("points a named thumb of a range at the label and at itself", async () => {
    await drawn(ranged());

    const [minimum] = screen.getAllByRole("slider");

    expect(minimum?.getAttribute("aria-labelledby")?.split(" ")).toStrictEqual([
      screen.getByText("Price").id,
      minimum?.id,
    ]);
  });

  it("takes only its own words without a label", async () => {
    await drawn(ranged({}, { labelled: false }));

    expect(thumb("Minimum").getAttribute("aria-labelledby")).toBeNull();
  });

  it("renders the hidden input a form submits", async () => {
    const { container } = await drawn(composed({ name: "volume" }));

    expect(container.querySelector<HTMLInputElement>('input[name="volume"]')?.value).toBe("40");
  });

  it("submits each thumb of a range under the root's name with brackets", async () => {
    const { container } = await drawn(ranged({ name: "price" }));

    expect(
      [...container.querySelectorAll<HTMLInputElement>('input[name="price[]"]')].map(
        (input) => input.value,
      ),
    ).toStrictEqual(["20", "80"]);
  });

  it("marks a read-only thumb", async () => {
    await drawn(composed({ readOnly: true }));

    expect(thumb().dataset["readonly"]).toBe("true");
  });

  it("keeps the value of a read-only thumb on ArrowRight", async () => {
    await drawn(composed({ readOnly: true }));
    await focused(thumb());
    await keyed(thumb(), "ArrowRight");

    expect(thumb().getAttribute("aria-valuenow")).toBe("40");
  });

  it("lists the field's texts in aria-describedby", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Volume</Field.Label>
        {composed({}, { labelled: false })}
        <Field.HelperText>Applies to every speaker.</Field.HelperText>
      </Field.Root>,
    );

    expect(thumb().getAttribute("aria-describedby")).toContain(
      screen.getByText("Applies to every speaker.").id,
    );
  });
});
