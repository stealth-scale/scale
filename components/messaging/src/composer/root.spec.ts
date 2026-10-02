import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";

import { bare, composed, field, pressed, typed } from "#composer/composer.fixtures.tsx";
import { Root } from "#composer/root.tsx";

describe("Root", () => {
  it("returns no conformance violation for its FORM root", () => {
    expect(violations(Root, { as: true, children: true, element: "FORM" })).toStrictEqual([]);
  });

  it("returns no accessibility violation for a composer", async () => {
    await expect(accessibilityViolations(() => composed())).resolves.toStrictEqual([]);
  });

  it("calls onSubmit with the text trimmed", () => {
    const onSubmit = vi.fn<(value: string) => void>();

    render(composed({ root: { onSubmit } }));
    typed("  Approved.  ");
    pressed("Send");

    expect(onSubmit.mock.lastCall).toStrictEqual(["Approved."]);
  });

  it("clears the text after a send", () => {
    render(composed());
    typed("Approved.");
    pressed("Send");

    expect(field().value).toBe("");
  });

  it("keeps a controlled text after a send", () => {
    render(composed({ root: { value: "Approved." } }));
    pressed("Send");

    expect(field().value).toBe("Approved.");
  });

  it("moves focus to the textarea after a send", () => {
    render(composed());
    typed("Approved.");
    pressed("Send");

    expect(document.activeElement).toBe(field());
  });

  it("sends nothing for text of whitespace", () => {
    const onSubmit = vi.fn<(value: string) => void>();

    render(composed({ root: { onSubmit } }));
    typed("   ");
    pressed("Send");

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("sends a message without text while files are attached", () => {
    const onSubmit = vi.fn<(value: string) => void>();

    render(composed({ root: { attached: true, onSubmit } }));
    pressed("Send");

    expect(onSubmit.mock.lastCall).toStrictEqual([""]);
  });

  it("sends nothing while busy", () => {
    const onSubmit = vi.fn<(value: string) => void>();

    render(composed({ root: { busy: true, onSubmit } }));
    typed("Approved.");
    pressed("Send");

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("sends nothing while disabled", () => {
    const onSubmit = vi.fn<(value: string) => void>();

    render(composed({ root: { defaultValue: "Approved.", disabled: true, onSubmit } }));
    pressed("Send");

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("calls onValueChange with the text on every change", () => {
    const onValueChange = vi.fn<(value: string) => void>();

    render(composed({ root: { onValueChange } }));
    typed("Appr");

    expect(onValueChange.mock.lastCall).toStrictEqual(["Appr"]);
  });

  it("sends without a textarea", () => {
    const onSubmit = vi.fn<(value: string) => void>();

    render(bare({ defaultValue: "Approved.", onSubmit }));
    pressed("Send");

    expect(onSubmit.mock.lastCall).toStrictEqual(["Approved."]);
  });
});
