import { act, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed, settled } from "@stealthscale/testing-react";

import { hiddenOf, opened, picker, trigger } from "#color-picker/color-picker.fixtures.tsx";

describe("HiddenInput", () => {
  it("holds the color in the format in force", async () => {
    const { container } = await drawn(picker());

    expect(hiddenOf(container).value).toBe("rgba(37, 99, 235, 1)");
  });

  it("leaves the tab order", async () => {
    const { container } = await drawn(picker());

    expect(hiddenOf(container).tabIndex).toBe(-1);
  });

  it("submits the color under the root's name", async () => {
    const { container } = await drawn(<form>{picker({ name: "brand" })}</form>);
    const form = container.querySelector("form") ?? undefined;

    expect(new FormData(form).get("brand")).toBe("rgba(37, 99, 235, 1)");
  });

  it("moves focus to the hex input when it takes focus", async () => {
    const { container } = await drawn(picker());

    act(() => {
      hiddenOf(container).focus();
    });
    await settled();

    expect(document.activeElement).toBe(screen.getByRole("textbox"));
  });

  it("moves focus to the trigger without a hex input", async () => {
    const { container } = await drawn(picker({}, { hex: false }));

    act(() => {
      hiddenOf(container).focus();
    });

    expect(document.activeElement).toBe(trigger());
  });

  it("restores the first color when its form resets", async () => {
    const { container } = await drawn(<form>{picker()}</form>);

    await opened();
    await pressed(screen.getByRole("button", { name: "Red" }));
    act(() => {
      container.querySelector("form")?.reset();
    });
    await settled();

    expect(hiddenOf(container).value).toBe("rgba(37, 99, 235, 1)");
  });
});
