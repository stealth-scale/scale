import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  createEngine,
  type Presentation,
  type Schema,
  translateFrom,
} from "@stealthscale/provider-form";
import { drawn, settled } from "@stealthscale/testing-react";

import { generated, written } from "#form/form.fixtures.tsx";
import { iban } from "#form/formats.ts";
import { edit } from "#input-mask/input-mask.fixtures.tsx";

const ADDRESS: Schema = {
  properties: { postcode: { title: "Postcode", type: "string" } },
  type: "object",
};

const MASKED: Presentation<Record<string, unknown>> = {
  fields: { postcode: { control: "mask", options: { mask: "9999 AA" } } },
  id: "profile",
};

const PAYEE: Schema = {
  properties: { account: { format: "iban", title: "IBAN", type: "string" } },
  type: "object",
};

const ENGINE = createEngine({ formats: [iban] });

/**
 * Returns the box of the label given.
 */
function box(name: string): HTMLInputElement {
  return screen.getByRole<HTMLInputElement>("textbox", { name });
}

/**
 * Submits the form.
 */
async function submitted(): Promise<void> {
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));
  await settled();
}

describe("MaskedField", () => {
  it("writes the typed characters into the pattern's form", async () => {
    await drawn(generated(ADDRESS, { presentation: MASKED }));
    edit(box("Postcode"), "1234ab", 6);
    await settled();

    expect(box("Postcode").value).toBe("1234 AB");
  });

  it("writes the value without the pattern's own characters into the form's values", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(ADDRESS, { onSubmit: submit, presentation: MASKED }));
    edit(box("Postcode"), "1234ab", 6);
    await settled();
    await submitted();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ postcode: "1234AB" });
  });

  it("shows the value the form starts from in the pattern's form", async () => {
    await drawn(generated(ADDRESS, { presentation: MASKED, values: { postcode: "1234AB" } }));

    expect(box("Postcode").value).toBe("1234 AB");
  });

  it("groups an IBAN in fours in capitals", async () => {
    await drawn(generated(PAYEE, { engine: ENGINE }));
    edit(box("IBAN"), "nl91abna0417164300", 18);
    await settled();

    expect(box("IBAN").value).toBe("NL91 ABNA 0417 1643 00");
  });

  it("writes an IBAN without its spaces into the form's values", async () => {
    const submit = vi.fn<(values: Readonly<Record<string, unknown>>) => void>();

    await drawn(generated(PAYEE, { engine: ENGINE, onSubmit: submit }));
    edit(box("IBAN"), "nl91abna0417164300", 18);
    await settled();
    await submitted();

    expect(submit.mock.lastCall?.[0]).toStrictEqual({ account: "NL91ABNA0417164300" });
  });

  it("refuses an IBAN whose check digits do not match", async () => {
    await drawn(
      generated(PAYEE, {
        engine: ENGINE,
        translate: translateFrom({ "errors.format": "Check the IBAN" }),
      }),
    );
    edit(box("IBAN"), "NL91ABNA0417164301", 18);
    await settled();
    await submitted();

    expect(screen.getByText("Check the IBAN")).toBeDefined();
  });

  it("takes the field's own pattern over the presentation's", async () => {
    await drawn(written("code", { code: "" }, (field) => <field.Masked mask="99-99" />));
    edit(box("Code"), "1234", 4);
    await settled();

    expect(box("Code").value).toBe("12-34");
  });

  it("renders an empty box in a form written by hand without a value", async () => {
    await drawn(written("code", {}, (field) => <field.Masked mask="99-99" />));

    expect(box("Code").value).toBe("");
  });

  it("keeps the typed text in a box without a pattern", async () => {
    await drawn(written("code", { code: "" }, (field) => <field.Masked />));
    edit(box("Code"), "a-1", 3);
    await settled();

    expect(box("Code").value).toBe("a-1");
  });

  it("floats the label in a form whose labels float", async () => {
    const { container } = await drawn(
      generated(ADDRESS, { orientation: "floating", presentation: MASKED }),
    );

    expect(container.querySelector(".field__root")?.className).toContain("field__root--floating");
  });

  it("runs the field's blur validators once focus leaves the box", async () => {
    await drawn(
      generated(ADDRESS, {
        fieldOptions: {
          postcode: { validators: { onBlur: () => "We deliver in the Netherlands" } },
        },
        presentation: MASKED,
      }),
    );
    fireEvent.blur(box("Postcode"));
    await settled();

    expect(screen.getByText("We deliver in the Netherlands")).toBeDefined();
  });
});
