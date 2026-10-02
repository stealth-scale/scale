import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Presentation, type Schema, translateFrom } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";
import { slotClass, slotClasses, variantClass } from "@stealthscale/testing-theme";

import { generated, written } from "#form/form.fixtures.tsx";

const BILLING: Schema = {
  properties: {
    period: { enum: ["month", "year"], title: "Billing period", type: "string" },
  },
  required: ["period"],
  type: "object",
};

const SEGMENTED: Presentation<Record<string, unknown>> = {
  fields: { period: { control: "segments" } },
  id: "profile",
};

const BLURRED = { period: { validators: { onBlur: (): string => "Yearly saves two months" } } };

/**
 * Returns the choice of the name given.
 */
function choice(name: string): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("radio", { name });
}

describe("SegmentField", () => {
  it("renders a group named by the field's label", async () => {
    await drawn(generated(BILLING, { presentation: SEGMENTED }));

    expect(screen.getByRole("radiogroup", { name: "Billing period" })).toBeDefined();
  });

  it("renders the segment group's track", async () => {
    const { container } = await drawn(generated(BILLING, { presentation: SEGMENTED }));

    expect(container.querySelector(`.${slotClass("segment-group", "root")}`)).not.toBeNull();
  });

  it("takes the form's size", async () => {
    const { container } = await drawn(generated(BILLING, { presentation: SEGMENTED, size: "lg" }));

    expect(slotClasses(container, "field", "root")).toContain(
      variantClass(slotClass("field", "root"), "size", "lg"),
    );
  });

  it("reads a choice's words from the catalogue", async () => {
    await drawn(
      generated(BILLING, {
        presentation: SEGMENTED,
        translate: translateFrom({ "profile.fields.period.options.year": "Yearly" }),
      }),
    );

    expect(choice("Yearly")).toBeDefined();
  });

  it("checks no choice until a person chooses", async () => {
    await drawn(generated(BILLING, { presentation: SEGMENTED }));

    expect(
      screen.getAllByRole<HTMLInputElement>("radio").map((each) => each.checked),
    ).toStrictEqual([false, false]);
  });

  it("checks the choice of the value the form starts from", async () => {
    await drawn(generated(BILLING, { presentation: SEGMENTED, values: { period: "year" } }));

    expect(choice("year").checked).toBe(true);
  });

  it("writes the choice a person makes into the form's values", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(BILLING, { onSubmit: submit, presentation: SEGMENTED }));
    fireEvent.click(choice("month"));
    await settled();
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await settled();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ period: "month" });
  });

  it("clears the choice on a form reset", async () => {
    const { container } = await drawn(generated(BILLING, { presentation: SEGMENTED }));

    fireEvent.click(choice("month"));
    await settled();
    fireEvent.reset(container.querySelector("form") ?? document.body);
    await settled();

    expect(choice("month").checked).toBe(false);
  });

  it("renders the choices the caller states over the schema's", async () => {
    await drawn(
      written("size", { size: "" }, (field) => <field.Segments options={["small", "large"]} />),
    );

    expect(screen.getAllByRole("radio").map((each) => each.getAttribute("value"))).toStrictEqual([
      "small",
      "large",
    ]);
  });

  it("renders no choice in a form written by hand without options", async () => {
    await drawn(written("size", { size: "" }, (field) => <field.Segments />));

    expect(screen.queryByRole("radio")).toBeNull();
  });

  it("runs the field's blur validators once focus leaves the group", async () => {
    await drawn(generated(BILLING, { fieldOptions: BLURRED, presentation: SEGMENTED }));
    fireEvent.blur(choice("month"), {
      relatedTarget: screen.getByRole("button", { name: "Submit" }),
    });
    await settled();

    expect(screen.getByText("Yearly saves two months")).toBeDefined();
  });

  it("runs no blur validator while focus moves between the choices", async () => {
    await drawn(generated(BILLING, { fieldOptions: BLURRED, presentation: SEGMENTED }));
    fireEvent.blur(choice("month"), { relatedTarget: choice("year") });
    await settled();

    expect(screen.queryByText("Yearly saves two months")).toBeNull();
  });
});
