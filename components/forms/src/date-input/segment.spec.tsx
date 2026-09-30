import { parseDate } from "@internationalized/date";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { dated, focused, keyed, segment, stay, typed } from "#date-input/date-input.fixtures.tsx";
import { Segments } from "#date-input/segments.tsx";
import * as Field from "#field/index.ts";

describe("Segment", () => {
  it("renders a spinbutton for each editable part of the date", async () => {
    await drawn(dated());

    expect(screen.getAllByRole("spinbutton")).toHaveLength(3);
  });

  it("is named by its type followed by the label", async () => {
    await drawn(dated());

    expect(segment("month, Appointment")).toBeDefined();
  });

  it("is named by its type and its group followed by the label in a range", async () => {
    await drawn(stay());

    expect(segment("month, Check-in, Stay")).toBeDefined();
  });

  it("is named by its type and its group without a label", async () => {
    await drawn(dated({}, { groups: <Segments aria-label="Birth date" />, label: null }));

    expect(segment("month, Birth date")).toBeDefined();
  });

  it("hides a separator from assistive technology", async () => {
    const { container } = await drawn(dated());

    expect(container.querySelector('[data-type="literal"]')?.getAttribute("aria-hidden")).toBe(
      "true",
    );
  });

  it("sets aria-valuetext to the placeholder while empty", async () => {
    await drawn(dated());

    expect(segment("year, Appointment").getAttribute("aria-valuetext")).toBe("yyyy");
  });

  it("sets aria-valuetext to the date's text", async () => {
    await drawn(dated({ defaultValue: [parseDate("2026-09-26")] }));

    expect(segment("day, Appointment").getAttribute("aria-valuetext")).toBe("26");
  });

  it("pads a one-digit month with a zero by default", async () => {
    await drawn(dated({ defaultValue: [parseDate("2026-09-26")] }));

    expect(segment("month, Appointment").textContent).toBe("09");
  });

  it("writes a one-digit month alone when shouldForceLeadingZeros is false", async () => {
    await drawn(dated({ defaultValue: [parseDate("2026-09-26")], shouldForceLeadingZeros: false }));

    expect(segment("month, Appointment").textContent).toBe("9");
  });

  it("sets a typed month", async () => {
    await drawn(dated());
    await focused(segment("month, Appointment"));
    await typed("9");

    expect(segment("month, Appointment").getAttribute("aria-valuenow")).toBe("9");
  });

  it("moves focus to the next segment once a typed month is complete", async () => {
    await drawn(dated());
    await focused(segment("month, Appointment"));
    await typed("9");

    expect(document.activeElement).toBe(segment("day, Appointment"));
  });

  it("steps the year to the next multiple of five on Page Up", async () => {
    await drawn(dated({ defaultValue: [parseDate("2026-09-26")] }));
    await focused(segment("year, Appointment"));
    await keyed(segment("year, Appointment"), "PageUp");

    expect(segment("year, Appointment").getAttribute("aria-valuenow")).toBe("2030");
  });

  it("is described by the field's texts when it is first", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Visit</Field.Label>
        {dated({}, { label: null })}
        <Field.HelperText>Pick a weekday.</Field.HelperText>
      </Field.Root>,
    );

    expect(segment("month, Visit").getAttribute("aria-describedby")).toContain(
      screen.getByText("Pick a weekday.").id,
    );
  });

  it("is undescribed after the first segment while valid", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Visit</Field.Label>
        {dated({}, { label: null })}
        <Field.HelperText>Pick a weekday.</Field.HelperText>
      </Field.Root>,
    );

    expect(segment("day, Visit").hasAttribute("aria-describedby")).toBe(false);
  });

  it("is described by the field's texts after the first segment while invalid", async () => {
    await drawn(
      <Field.Root invalid>
        <Field.Label>Visit</Field.Label>
        {dated({}, { label: null })}
        <Field.ErrorText>Pick a date.</Field.ErrorText>
      </Field.Root>,
    );

    expect(segment("day, Visit").getAttribute("aria-describedby")).toContain(
      screen.getByText("Pick a date.").id,
    );
  });

  it("is undescribed in the second group of a range while valid", async () => {
    await drawn(
      <Field.Root>
        {stay()}
        <Field.HelperText>Two nights at least.</Field.HelperText>
      </Field.Root>,
    );

    expect(segment("month, Check-out, Stay").hasAttribute("aria-describedby")).toBe(false);
  });
});
