import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import * as FieldParts from "#field/index.ts";
import { Field } from "#native-select/field.tsx";
import { selected } from "#native-select/native-select.fixtures.tsx";
import { Root } from "#native-select/root.tsx";

/**
 * Label of the field every wired case renders.
 */
const LABEL = "Currency";

describe("Field", () => {
  it("renders a SELECT for the field slot", () => {
    const { container } = render(selected());

    expect(slotElement(container, "native-select", "field").tagName).toBe("SELECT");
  });

  it("renders the placeholder as a first option with an empty value", () => {
    const { container } = render(selected());

    expect(container.querySelector("option")?.getAttribute("value")).toBe("");
  });

  it("renders no extra option without a placeholder", () => {
    const { container } = render(
      <Root>
        <Field aria-label={LABEL}>
          <option value="eur">Euro</option>
        </Field>
      </Root>,
    );

    expect(container.querySelectorAll("option")).toHaveLength(1);
  });

  it("is named by the label of the field around it", () => {
    render(
      <FieldParts.Root>
        <FieldParts.Label>{LABEL}</FieldParts.Label>
        <Root>
          <Field>
            <option value="eur">Euro</option>
          </Field>
        </Root>
      </FieldParts.Root>,
    );

    expect(screen.getByRole("combobox", { name: LABEL }).tagName).toBe("SELECT");
  });

  it("is described by the helper text of the field around it", () => {
    render(
      <FieldParts.Root>
        <FieldParts.Label>{LABEL}</FieldParts.Label>
        <Root>
          <Field>
            <option value="eur">Euro</option>
          </Field>
        </Root>
        <FieldParts.HelperText>Payouts are sent in this currency.</FieldParts.HelperText>
      </FieldParts.Root>,
    );

    expect(
      screen.getByRole("combobox", { name: LABEL }).getAttribute("aria-describedby"),
    ).toContain(screen.getByText("Payouts are sent in this currency.").id);
  });

  it("states aria-invalid while the field around it is invalid", () => {
    render(
      <FieldParts.Root invalid>
        <FieldParts.Label>{LABEL}</FieldParts.Label>
        <Root>
          <Field>
            <option value="eur">Euro</option>
          </Field>
        </Root>
      </FieldParts.Root>,
    );

    expect(screen.getByRole("combobox", { name: LABEL }).getAttribute("aria-invalid")).toBe("true");
  });

  it("takes the required state of the field around it", () => {
    render(
      <FieldParts.Root required>
        <FieldParts.Label>{LABEL}</FieldParts.Label>
        <Root>
          <Field>
            <option value="eur">Euro</option>
          </Field>
        </Root>
      </FieldParts.Root>,
    );

    expect(screen.getByRole("combobox", { name: LABEL })).toHaveProperty("required", true);
  });

  it("keeps the disabled state the caller passes over the field's", () => {
    render(
      <FieldParts.Root>
        <FieldParts.Label>{LABEL}</FieldParts.Label>
        <Root>
          <Field disabled>
            <option value="eur">Euro</option>
          </Field>
        </Root>
      </FieldParts.Root>,
    );

    expect(screen.getByRole("combobox", { name: LABEL })).toHaveProperty("disabled", true);
  });

  it("returns no accessibility violation inside a field", async () => {
    await expect(
      accessibilityViolations(() => (
        <FieldParts.Root>
          <FieldParts.Label>{LABEL}</FieldParts.Label>
          <Root>
            <Field>
              <option value="eur">Euro</option>
            </Field>
          </Root>
        </FieldParts.Root>
      )),
    ).resolves.toStrictEqual([]);
  });
});
