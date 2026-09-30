import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { opened, picker, trigger } from "#color-picker/color-picker.fixtures.tsx";
import * as Field from "#field/index.ts";

describe("Trigger", () => {
  it("renders a button", async () => {
    await drawn(picker());

    expect(trigger().tagName).toBe("BUTTON");
  });

  it("is named by the label and the color of its swatch", async () => {
    await drawn(picker());

    expect(screen.getByRole("button", { name: "Brand color #2563EB" })).toBe(trigger());
  });

  it("points aria-labelledby at the label and at itself", async () => {
    await drawn(picker());

    expect(trigger().getAttribute("aria-labelledby")).toBe(
      `${screen.getByText("Brand color").id} ${trigger().id}`,
    );
  });

  it("keeps the caller's aria-label without a label", async () => {
    await drawn(picker({}, { labelled: false, named: "Accent" }));

    expect(trigger().getAttribute("aria-label")).toBe("Accent");
  });

  it("drops the machine's aria-label", async () => {
    await drawn(picker());

    expect(trigger().hasAttribute("aria-label")).toBe(false);
  });

  it("is described by the field's helper text", async () => {
    await drawn(
      <Field.Root>
        <Field.Label>Accent</Field.Label>
        {picker({}, { labelled: false })}
        <Field.HelperText>Buttons take it.</Field.HelperText>
      </Field.Root>,
    );

    expect(trigger().getAttribute("aria-describedby")).toContain(
      screen.getByText("Buttons take it.").id,
    );
  });

  it("opens the panel on a press", async () => {
    await drawn(picker());
    await opened();

    expect(trigger().getAttribute("aria-expanded")).toBe("true");
  });
});
