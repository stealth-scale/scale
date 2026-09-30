import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, drawn } from "@stealthscale/testing-react";
import { slotElement, variantClass } from "@stealthscale/testing-theme";

import * as Field from "#field/index.ts";
import * as Fieldset from "#fieldset/index.ts";
import { composed, hiddenInput, stroked } from "#signature-pad/signature-pad.fixtures.tsx";

describe("Root", () => {
  it("returns no accessibility violation for a labelled pad", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("renders a fieldset named by the label", async () => {
    await drawn(composed());

    expect(screen.getByRole("group", { name: "Signature" }).tagName).toBe("FIELDSET");
  });

  it("disables the fieldset of a disabled pad", async () => {
    await drawn(composed({ disabled: true }));

    expect(screen.getByRole<HTMLFieldSetElement>("group").disabled).toBe(true);
  });

  it("renders the hidden input after its parts", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "signature-pad", "root").lastElementChild?.tagName).toBe("INPUT");
  });

  it("leaves the hidden input empty while nothing is drawn", async () => {
    const { container } = await drawn(composed());

    expect(hiddenInput(container).value).toBe("");
  });

  it("writes the strokes into the hidden input as an SVG data URL", async () => {
    const { container } = await drawn(composed());

    await stroked(screen.getByRole("application"));

    expect(hiddenInput(container).value.startsWith("data:image/svg+xml,")).toBe(true);
  });

  it("keeps the hidden input's value when the input reports a change", async () => {
    const { container } = await drawn(composed());

    fireEvent.change(hiddenInput(container), { target: { value: "forged" } });

    expect(hiddenInput(container).value).toBe("");
  });

  it("keeps the hidden input editable so required blocks a blank pad", async () => {
    const { container } = await drawn(composed({ required: true }));

    expect([hiddenInput(container).readOnly, hiddenInput(container).checkValidity()]).toStrictEqual(
      [false, false],
    );
  });

  it("names the hidden input only when the caller passes name", async () => {
    const { container, rerender } = await drawn(composed());
    const unnamed = hiddenInput(container).hasAttribute("name");

    rerender(composed({ name: "signature" }));

    expect([unnamed, hiddenInput(container).name]).toStrictEqual([false, "signature"]);
  });

  it("passes size to the recipe", async () => {
    const { container } = await drawn(composed({ size: "lg" }));

    expect([...slotElement(container, "signature-pad", "root").classList]).toContain(
      variantClass("signature-pad__root", "size", "lg"),
    );
  });

  it("passes palette to the recipe", async () => {
    const { container } = await drawn(composed({ palette: "info" }));

    expect([...slotElement(container, "signature-pad", "root").classList]).toContain(
      variantClass("signature-pad__root", "palette", "info"),
    );
  });

  it("takes the size of the field around it", async () => {
    const { container } = await drawn(<Field.Root size="sm">{composed()}</Field.Root>);

    expect([...slotElement(container, "signature-pad", "root").classList]).toContain(
      variantClass("signature-pad__root", "size", "sm"),
    );
  });

  it("takes the disabled state of the fieldset around it", async () => {
    await drawn(<Fieldset.Root disabled>{composed()}</Fieldset.Root>);

    expect(screen.getByRole("application").getAttribute("aria-disabled")).toBe("true");
  });
});
