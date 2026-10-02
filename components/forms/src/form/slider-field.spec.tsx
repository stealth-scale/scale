import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { type Presentation, type Schema } from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { generated, written } from "#form/form.fixtures.tsx";
import { focused, keyed, thumb } from "#slider/slider.fixtures.tsx";

const PLAN: Schema = {
  properties: { seats: { maximum: 50, minimum: 1, title: "Seats", type: "integer" } },
  type: "object",
};

const SLIDING: Presentation<Record<string, unknown>> = {
  fields: { seats: { control: "slider" } },
  id: "profile",
};

describe("SliderField", () => {
  it("renders a thumb named by the field's label", async () => {
    await drawn(generated(PLAN, { presentation: SLIDING }));

    expect(thumb("Seats")).toBeDefined();
  });

  it("bounds the thumb by the schema's minimum and maximum", async () => {
    await drawn(generated(PLAN, { presentation: SLIDING }));

    expect([
      thumb("Seats").getAttribute("aria-valuemin"),
      thumb("Seats").getAttribute("aria-valuemax"),
    ]).toStrictEqual(["1", "50"]);
  });

  it("bounds the thumb from 0 to 100 where the schema states no bounds", async () => {
    await drawn(written("level", { level: 30 }, (field) => <field.Slider />));

    expect([
      thumb("Level").getAttribute("aria-valuemin"),
      thumb("Level").getAttribute("aria-valuemax"),
    ]).toStrictEqual(["0", "100"]);
  });

  it("shows a value below the minimum at the minimum", async () => {
    await drawn(generated(PLAN, { presentation: SLIDING }));

    expect(thumb("Seats").getAttribute("aria-valuenow")).toBe("1");
  });

  it("rests the thumb at the minimum in a form written by hand without a value", async () => {
    await drawn(written("level", {}, (field) => <field.Slider />));

    expect(thumb("Level").getAttribute("aria-valuenow")).toBe("0");
  });

  it("shows the value the form starts from", async () => {
    await drawn(generated(PLAN, { presentation: SLIDING, values: { seats: 12 } }));

    expect(thumb("Seats").getAttribute("aria-valuenow")).toBe("12");
  });

  it("writes the value a key moves the thumb to into the form's values", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(
      generated(PLAN, { onSubmit: submit, presentation: SLIDING, values: { seats: 12 } }),
    );
    await focused(thumb("Seats"));
    await keyed(thumb("Seats"), "ArrowRight");
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await settled();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ seats: 13 });
  });

  it("formats the value as the presentation's options state", async () => {
    const { container } = await drawn(
      generated(PLAN, {
        presentation: {
          fields: {
            seats: {
              control: "slider",
              options: { maximumFractionDigits: 0, style: "unit", unit: "kilometer" },
            },
          },
          id: "profile",
        },
        values: { seats: 12 },
      }),
    );

    expect(slotElement(container, "slider", "valueText").textContent).toBe("12 km");
  });

  it("formats the value as the field's props state over the presentation's", async () => {
    const { container } = await drawn(
      written("share", { share: 0.4 }, (field) => (
        <field.Slider formatOptions={{ style: "percent" }} step={0.1} />
      )),
    );

    expect(slotElement(container, "slider", "valueText").textContent).toBe("40%");
  });

  it("runs the field's blur validators once focus leaves the thumb", async () => {
    await drawn(
      generated(PLAN, {
        fieldOptions: { seats: { validators: { onBlur: () => "Ask sales for more seats" } } },
        presentation: SLIDING,
      }),
    );
    fireEvent.blur(thumb("Seats"), {
      relatedTarget: screen.getByRole("button", { name: "Submit" }),
    });
    await settled();

    expect(screen.getByText("Ask sales for more seats")).toBeDefined();
  });
});
