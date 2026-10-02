import { parseDate } from "@internationalized/date";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { boundMachineViolations, slotElement, variantClass } from "@stealthscale/testing-theme";

import {
  dated,
  focused,
  hiddenOf,
  segment,
  stay,
  typed,
} from "#date-input/date-input.fixtures.tsx";
import { type RootProps, type ValueChangeDetails } from "#date-input/index.ts";
import { recipe } from "#date-input/recipe.ts";
import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";

describe("Root", () => {
  it("returns no accessibility violation for a labelled date input", async () => {
    await expect(accessibilityViolations(() => dated())).resolves.toStrictEqual([]);
  });

  it("returns no accessibility violation for a range", async () => {
    await expect(
      accessibilityViolations(() => stay({ defaultValue: [parseDate("2026-10-02")] })),
    ).resolves.toStrictEqual([]);
  });

  it("applies the class of every value its recipe offers", async () => {
    await expect(
      boundMachineViolations(
        recipe,
        async (props: RootProps) => (await drawn(dated(props))).container,
        { slot: "root" },
      ),
    ).resolves.toStrictEqual([]);
  });

  it("renders a div", async () => {
    const { container } = await drawn(dated());

    expect(slotElement(container, "date-input", "root").tagName).toBe("DIV");
  });

  it("renders one hidden input for a single date", async () => {
    const { container } = await drawn(dated());

    expect(container.querySelectorAll("input")).toHaveLength(1);
  });

  it("renders two hidden inputs for a range", async () => {
    const { container } = await drawn(stay());

    expect(container.querySelectorAll("input")).toHaveLength(2);
  });

  it("calls onValueChange with the typed date", async () => {
    const changed = vi.fn<(details: ValueChangeDetails) => void>();

    await drawn(dated({ onValueChange: changed }));
    await focused(segment("month, Appointment"));
    await typed("09262026");

    expect(changed.mock.lastCall?.[0].value.map(String)).toStrictEqual(["2026-09-26"]);
  });

  it("names the segments in its locale", async () => {
    await drawn(dated({ locale: "de-DE" }));

    expect(segment("Monat, Appointment")).toBeDefined();
  });

  it("takes the size of the field around it", async () => {
    const { container } = await drawn(<Field.Root size="lg">{dated()}</Field.Root>);

    expect([...slotElement(container, "date-input", "segmentGroup").classList]).toContain(
      variantClass("date-input__segment-group", "size", "lg"),
    );
  });

  it("keeps its own size over the field's", async () => {
    const { container } = await drawn(<Field.Root size="lg">{dated({ size: "sm" })}</Field.Root>);

    expect([...slotElement(container, "date-input", "segmentGroup").classList]).toContain(
      variantClass("date-input__segment-group", "size", "sm"),
    );
  });

  it("takes the disabled state of the fieldset around it", async () => {
    await drawn(<Fieldset.Root disabled>{dated()}</Fieldset.Root>);

    expect(segment("month, Appointment").getAttribute("aria-disabled")).toBe("true");
  });

  it("takes the required state of the field around it", async () => {
    const { container } = await drawn(<Field.Root required>{dated()}</Field.Root>);

    expect(hiddenOf(container).required).toBe(true);
  });

  it("takes the invalid state of the field around it", async () => {
    await drawn(<Field.Root invalid>{dated()}</Field.Root>);

    expect(segment("month, Appointment").getAttribute("aria-invalid")).toBe("true");
  });

  it("takes the read-only state of the field around it", async () => {
    await drawn(<Field.Root readOnly>{dated()}</Field.Root>);

    expect(segment("month, Appointment").getAttribute("aria-readonly")).toBe("true");
  });

  it("names the group by the field's label", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Visit</Field.Label>
        {dated({}, { label: null })}
      </Field.Root>,
    );

    expect(screen.getByRole("group", { name: "Visit" })).toBeDefined();
  });

  it("names the segments by the field's label", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Visit</Field.Label>
        {dated({}, { label: null })}
      </Field.Root>,
    );

    expect(segment("day, Visit")).toBeDefined();
  });
});
