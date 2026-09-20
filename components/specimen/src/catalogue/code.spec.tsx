import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Code } from "#catalogue/code.tsx";

const SOURCE = 'import { Button } from "@stealthscale/component-actions";';

describe("Code", () => {
  it("draws the passage in the library's code block at the small size", async () => {
    const { container } = await drawn(<Code code={SOURCE} title="button.tsx" />);

    expect(slotElement(container, "code-block", "code").textContent).toBe(SOURCE);
    expect(
      slotElement(container, "code-block", "code").classList.contains("code-block__code--sm"),
    ).toBe(true);
  });

  it("heads the block with the title it is given", async () => {
    const { container } = await drawn(<Code code={SOURCE} title="button.tsx" />);

    expect(slotElement(container, "code-block", "title").textContent).toBe("button.tsx");
  });

  it("colours the passage as tsx unless a language is named", async () => {
    const { container } = await drawn(<Code code={SOURCE} title="button.tsx" />);
    const plain = await drawn(<Code code={SOURCE} language="brainfuck" title="button.tsx" />);

    expect(container.querySelector("[data-token=keyword]")).not.toBeNull();
    expect(plain.container.querySelector("[data-token]")).toBeNull();
  });

  it("names the copy control with the catalogue's words", async () => {
    const { getByRole } = await drawn(<Code code={SOURCE} title="button.tsx" />);

    expect(getByRole("button", { name: "Copy the code" })).toBeDefined();
  });

  it("copies the passage and says so when the control is pressed", async () => {
    const { getByRole } = await drawn(<Code code={SOURCE} title="button.tsx" />);

    await pressed(getByRole("button", { name: "Copy the code" }));

    expect(getByRole("button", { name: "Copied the code" })).toBeDefined();
    await expect(navigator.clipboard.readText()).resolves.toBe(SOURCE);
  });

  it("draws the control as the library's icon button on the neutral palette", async () => {
    const { getByRole } = await drawn(<Code code={SOURCE} title="button.tsx" />);
    const control = getByRole("button", { name: "Copy the code" });

    expect(control.classList.contains("button--ghost")).toBe(true);
    expect(control.classList.contains("button--neutral")).toBe(true);
    expect(control.classList.contains("button--xs")).toBe(true);
  });
});
