import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import * as Field from "#field/index.ts";
import { composed, paths, stroked } from "#signature-pad/signature-pad.fixtures.tsx";

describe("Control", () => {
  it("renders a div in the application role", async () => {
    await drawn(composed());

    expect(screen.getByRole("application").tagName).toBe("DIV");
  });

  it("describes its role as a signature pad", async () => {
    await drawn(composed());

    expect(screen.getByRole("application").getAttribute("aria-roledescription")).toBe(
      "signature pad",
    );
  });

  it("takes its name from the label", async () => {
    await drawn(composed());

    expect(screen.getByRole("application", { name: "Signature" })).toBeDefined();
  });

  it("drops the machine's aria-label", async () => {
    await drawn(composed());

    expect(screen.getByRole("application").getAttribute("aria-label")).toBeNull();
  });

  it("drops the machine's inline styles", async () => {
    await drawn(composed());

    expect(screen.getByRole("application").getAttribute("style")).toBeNull();
  });

  it("takes its name and description from the field around it", async () => {
    await drawn(
      <Field.Root id="consent">
        <Field.Label>Your signature</Field.Label>
        {composed({}, { labelled: false })}
        <Field.HelperText>Sign as on your passport.</Field.HelperText>
      </Field.Root>,
    );

    expect(
      screen.getByRole("application", { name: "Your signature" }).getAttribute("aria-describedby"),
    ).toBe("consent-helper consent-error");
  });

  it("is in the tab order", async () => {
    await drawn(composed());

    expect(screen.getByRole("application").tabIndex).toBe(0);
  });

  it("leaves the tab order while disabled", async () => {
    await drawn(composed({ disabled: true }));

    expect(screen.getByRole("application").hasAttribute("tabindex")).toBe(false);
  });

  it("sets aria-invalid while the signature is invalid", async () => {
    await drawn(composed({ invalid: true }));

    expect(screen.getByRole("application").getAttribute("aria-invalid")).toBe("true");
  });

  it("sets data-readonly while the pad is read-only", async () => {
    await drawn(composed({ readOnly: true }));

    expect(screen.getByRole("application").dataset["readonly"]).toBe("");
  });

  it("draws a stroke under a primary pointer", async () => {
    const { container } = await drawn(composed());

    await stroked(screen.getByRole("application"));

    expect(paths(container)).toHaveLength(1);
  });

  it("draws no stroke while read-only", async () => {
    const { container } = await drawn(composed({ readOnly: true }));

    await stroked(screen.getByRole("application"));

    expect(paths(container)).toHaveLength(0);
  });

  it("draws no stroke under a secondary button", async () => {
    const { container } = await drawn(composed());

    fireEvent.pointerDown(screen.getByRole("application"), { button: 2, clientX: 30, clientY: 30 });
    await settled();

    expect(paths(container)).toHaveLength(0);
  });
});
