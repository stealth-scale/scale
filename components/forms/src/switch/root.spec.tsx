import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { boundViolations, slotElement } from "@stealthscale/testing-theme";

import { ErrorText } from "#field/error-text.tsx";
import { HelperText } from "#field/helper-text.tsx";
import { Root as FieldRoot } from "#field/root.tsx";
import { recipe } from "#switch/recipe.ts";
import { type RootProps } from "#switch/root.tsx";
import { composed, pressed } from "#switch/switch.fixtures.tsx";

describe("Root", () => {
  it("breaks no accessibility rule holding a track and its words", async () => {
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

    expect(slotElement(container, "switch", "root").tagName).toBe("LABEL");
  });

  it("announces the control as a switch rather than as a checkbox", () => {
    render(composed());

    expect(screen.getByRole("switch")).toBeTruthy();
    expect(screen.queryByRole("checkbox")).toBeNull();
  });

  it("names the switch from the words beside the track", () => {
    render(composed());

    expect(screen.getByRole("switch", { name: "Dark mode" })).toBeTruthy();
  });

  it("points the label at the control it holds", () => {
    const { container } = render(composed());

    expect(slotElement(container, "switch", "root").getAttribute("for")).toBe(
      screen.getByRole("switch").id,
    );
  });

  it("draws the control a form submits", () => {
    render(composed({ name: "theme", value: "dark" }));

    expect(screen.getByRole("switch").getAttribute("name")).toBe("theme");
  });

  it("turns the switch on when the row is pressed", async () => {
    render(composed());
    await pressed(screen.getByRole("switch"));

    expect(screen.getByRole<HTMLInputElement>("switch").checked).toBe(true);
  });

  it("reports the state it moved to", async () => {
    const heard = vi.fn<(details: { checked: boolean }) => void>();

    render(composed({ onCheckedChange: heard }));
    await pressed(screen.getByRole("switch"));

    expect(heard).toHaveBeenCalledWith({ checked: true });
  });

  it("takes a switch out of reach where a caller disables it", () => {
    render(composed({ disabled: true }));

    expect(screen.getByRole<HTMLInputElement>("switch").disabled).toBe(true);
  });

  it("takes the disabled state of the field it stands in", () => {
    render(<FieldRoot disabled>{composed()}</FieldRoot>);

    expect(screen.getByRole<HTMLInputElement>("switch").disabled).toBe(true);
  });

  it("takes the required state of the field it stands in", () => {
    render(<FieldRoot required>{composed()}</FieldRoot>);

    expect(screen.getByRole<HTMLInputElement>("switch").required).toBe(true);
  });

  it("is described by the texts of the field it stands in", () => {
    render(
      <FieldRoot id="theme" invalid>
        {composed()}
        <HelperText>It follows your system by default.</HelperText>
        <ErrorText>That theme is not available.</ErrorText>
      </FieldRoot>,
    );

    expect(screen.getByRole("switch").getAttribute("aria-describedby")?.split(" ")).toStrictEqual([
      "theme-helper",
      screen.getByText("That theme is not available.").id,
    ]);
  });

  it("describes a switch standing on its own by nothing", () => {
    render(composed());

    expect(screen.getByRole("switch").getAttribute("aria-describedby")).toBeNull();
  });

  it("keeps its own state where it states one inside a field", () => {
    render(<FieldRoot disabled>{composed({ disabled: false })}</FieldRoot>);

    expect(screen.getByRole<HTMLInputElement>("switch").disabled).toBe(false);
  });
});
