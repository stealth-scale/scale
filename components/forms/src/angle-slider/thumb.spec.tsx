import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { composed, focused, keyed, thumb } from "#angle-slider/angle-slider.fixtures.tsx";
import * as Field from "#field/index.ts";

describe("Thumb", () => {
  it("renders an element in the slider role named after the label", async () => {
    await drawn(composed());

    expect(thumb().tagName).toBe("DIV");
  });

  it("sets the value and its bounds as ARIA values", async () => {
    await drawn(composed());

    expect(
      ["aria-valuenow", "aria-valuemin", "aria-valuemax"].map((name) => thumb().getAttribute(name)),
    ).toStrictEqual(["45", "0", "359"]);
  });

  it("sets the value in degrees as aria-valuetext", async () => {
    await drawn(composed({ locale: "en-GB" }));

    expect(thumb().getAttribute("aria-valuetext")).toBe("45°");
  });

  it("sets the value in the root's format as aria-valuetext", async () => {
    await drawn(composed({ formatOptions: { maximumFractionDigits: 0 }, locale: "en-GB" }));

    expect(thumb().getAttribute("aria-valuetext")).toBe("45");
  });

  it("leaves out the machine's inline rotate", async () => {
    await drawn(composed());

    expect(thumb().style.getPropertyValue("rotate")).toBe("");
  });

  it("takes a place in the tab order", async () => {
    await drawn(composed());

    expect(thumb().tabIndex).toBe(0);
  });

  it.each([
    { key: "ArrowRight", value: "46" },
    { key: "ArrowUp", value: "46" },
    { key: "ArrowLeft", value: "44" },
    { key: "ArrowDown", value: "44" },
  ])("sets $value on $key", async ({ key, value }) => {
    await drawn(composed());
    await focused(thumb());
    await keyed(thumb(), key);

    expect(thumb().getAttribute("aria-valuenow")).toBe(value);
  });

  it("steps the value to the next ten degrees on PageUp", async () => {
    await drawn(composed());
    await focused(thumb());
    await keyed(thumb(), "PageUp");

    expect(thumb().getAttribute("aria-valuenow")).toBe("60");
  });

  it("steps the value to the next ten degrees on ArrowRight with Shift", async () => {
    await drawn(composed());
    await focused(thumb());
    await keyed(thumb(), "ArrowRight", true);

    expect(thumb().getAttribute("aria-valuenow")).toBe("60");
  });

  it("steps the value up on ArrowLeft under rtl", async () => {
    await drawn(composed({ dir: "rtl" }));
    await focused(thumb());
    await keyed(thumb(), "ArrowLeft");

    expect(thumb().getAttribute("aria-valuenow")).toBe("46");
  });

  it.each([
    { key: "Home", value: "0" },
    { key: "End", value: "359" },
  ])("sets $value on $key", async ({ key, value }) => {
    await drawn(composed());
    await focused(thumb());
    await keyed(thumb(), key);

    expect(thumb().getAttribute("aria-valuenow")).toBe(value);
  });

  it("keeps the page from scrolling for a key it maps", async () => {
    await drawn(composed());
    await focused(thumb());

    const scrolled = fireEvent.keyDown(thumb(), { key: "PageDown" });

    await settled();

    expect(scrolled).toBe(false);
  });

  it("leaves a key it does not map to the page", async () => {
    await drawn(composed());
    await focused(thumb());

    expect(fireEvent.keyDown(thumb(), { key: "Enter" })).toBe(true);
  });

  it("keeps the value when the caller's handler cancels the key", async () => {
    await drawn(
      composed(
        {},
        {
          thumb: {
            onKeyDown: (event) => {
              event.preventDefault();
            },
          },
        },
      ),
    );
    await focused(thumb());
    await keyed(thumb(), "ArrowRight");

    expect(thumb().getAttribute("aria-valuenow")).toBe("45");
  });

  it("marks a read-only thumb", async () => {
    await drawn(composed({ readOnly: true }));

    expect(thumb().dataset["readonly"]).toBe("");
  });

  it("keeps the value of a read-only thumb on ArrowRight", async () => {
    await drawn(composed({ readOnly: true }));
    await focused(thumb());
    await keyed(thumb(), "ArrowRight");

    expect(thumb().getAttribute("aria-valuenow")).toBe("45");
  });

  it("marks a disabled thumb as disabled", async () => {
    await drawn(composed({ disabled: true }));

    expect(thumb().getAttribute("aria-disabled")).toBe("true");
  });

  it("leaves an enabled thumb without aria-disabled", async () => {
    await drawn(composed());

    expect(thumb().getAttribute("aria-disabled")).toBeNull();
  });

  it("takes its own words without a label", async () => {
    await drawn(composed({}, { labelled: false, thumb: { label: "Hue" } }));

    expect(thumb("Hue").getAttribute("aria-labelledby")).toBeNull();
  });

  it("lists the field's texts in aria-describedby", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Rotation</Field.Label>
        {composed({}, { labelled: false })}
        <Field.HelperText>Turns the whole layer.</Field.HelperText>
      </Field.Root>,
    );

    expect(thumb().getAttribute("aria-describedby")).toContain(
      screen.getByText("Turns the whole layer.").id,
    );
  });
});
