import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { composed, pressed } from "#checkbox/checkbox.fixtures.tsx";
import { recipe } from "#checkbox/recipe.ts";
import { type RootProps } from "#checkbox/root.tsx";
import { ErrorText } from "#field/error-text.tsx";
import { HelperText } from "#field/helper-text.tsx";
import { Root as FieldRoot } from "#field/root.tsx";

describe("Root", () => {
  it("breaks no accessibility rule holding a box and its words", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("writes the class of every value its recipe offers", () => {
    expect(
      boundViolations(recipe, (props: RootProps) => render(composed(props)).container, {
        slot: "root",
      }),
    ).toStrictEqual([]);
  });

  it("draws a label the whole row sits in", () => {
    const { container } = render(composed());

    expect(slotElement(container, "checkbox", "root").tagName).toBe("LABEL");
  });

  it("draws the checkbox a form submits and a reader is told about", () => {
    render(composed({ name: "terms", value: "yes" }));

    expect(screen.getByRole("checkbox").getAttribute("name")).toBe("terms");
  });

  it("names the checkbox from the words beside the box", () => {
    render(composed());

    expect(screen.getByRole("checkbox", { name: "Accept the terms" })).toBeTruthy();
  });

  it("points the label at the checkbox it holds", () => {
    const { container } = render(composed());

    expect(slotElement(container, "checkbox", "root").getAttribute("for")).toBe(
      screen.getByRole("checkbox").id,
    );
  });

  it("turns the checkbox on when the row is pressed", async () => {
    render(composed());
    await pressed(screen.getByRole("checkbox"));

    expect(screen.getByRole<HTMLInputElement>("checkbox").checked).toBe(true);
  });

  it("reports the state it moved to", async () => {
    const heard = vi.fn<(details: { checked: "indeterminate" | boolean }) => void>();

    render(composed({ onCheckedChange: heard }));
    await pressed(screen.getByRole("checkbox"));

    expect(heard).toHaveBeenCalledWith({ checked: true });
  });

  it("breaks no accessibility rule while the checkbox is partly on", async () => {
    await expect(
      accessibilityViolations(() => composed({ checked: "indeterminate" })),
    ).resolves.toStrictEqual([]);
  });

  it("reports the checkbox as mixed on the frame it is drawn partly on", () => {
    render(composed({ checked: "indeterminate" }));

    expect(screen.getByRole<HTMLInputElement>("checkbox").indeterminate).toBe(true);
  });

  it("leaves the checkbox unmixed where it is plainly on", () => {
    render(composed({ defaultChecked: true }));

    expect(screen.getByRole<HTMLInputElement>("checkbox").indeterminate).toBe(false);
  });

  it("takes a checkbox out of reach where a caller disables it", () => {
    render(composed({ disabled: true }));

    expect(screen.getByRole<HTMLInputElement>("checkbox").disabled).toBe(true);
  });

  it("takes the disabled state of the field it stands in", () => {
    render(<FieldRoot disabled>{composed()}</FieldRoot>);

    expect(screen.getByRole<HTMLInputElement>("checkbox").disabled).toBe(true);
  });

  it("takes the required state of the field it stands in", () => {
    render(<FieldRoot required>{composed()}</FieldRoot>);

    expect(screen.getByRole<HTMLInputElement>("checkbox").required).toBe(true);
  });

  it("is described by the texts of the field it stands in", () => {
    render(
      <FieldRoot id="terms" invalid>
        {composed()}
        <HelperText>Read them first.</HelperText>
        <ErrorText>Accept them to go on.</ErrorText>
      </FieldRoot>,
    );

    expect(screen.getByRole("checkbox").getAttribute("aria-describedby")?.split(" ")).toStrictEqual(
      ["terms-helper", screen.getByText("Accept them to go on.").id],
    );
  });

  it("describes a checkbox standing on its own by nothing", () => {
    render(composed());

    expect(screen.getByRole("checkbox").getAttribute("aria-describedby")).toBeNull();
  });

  it("keeps its own state where it states one inside a field", () => {
    render(<FieldRoot disabled>{composed({ disabled: false })}</FieldRoot>);

    expect(screen.getByRole<HTMLInputElement>("checkbox").disabled).toBe(false);
  });
});
