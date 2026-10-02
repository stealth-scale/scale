import { describe, expect, it } from "vitest";

import { slotClass, slotVariantClass } from "@stealthscale/testing-theme";

import { rendered } from "#markdown/markdown.fixtures.tsx";

describe("renderCallout", () => {
  it("titles a callout by its kind", () => {
    const { getByText } = rendered("> [!WARNING]\n> Keys rotate on Monday.\n");

    expect(getByText("Warning").closest(`.${slotClass("alert", "root")}`)).not.toBeNull();
  });

  it.each([
    { kind: "NOTE", status: "info" },
    { kind: "TIP", status: "success" },
    { kind: "IMPORTANT", status: "neutral" },
    { kind: "WARNING", status: "warning" },
    { kind: "CAUTION", status: "error" },
    { kind: "DANGER", status: "info" },
  ])("renders a $kind callout at the $status status", ({ kind, status }) => {
    const { container } = rendered(`> [!${kind}]\n> Text.\n`);

    expect(
      container.querySelector(`.${slotVariantClass("alert", "root", "status", status)}`),
    ).not.toBeNull();
  });

  it("renders a callout without a live role", () => {
    const { container } = rendered("> [!NOTE]\n> Text.\n");

    expect(container.querySelector("[role=status], [role=alert]")).toBeNull();
  });

  it("renders the caller's icon for the kind", () => {
    const { container } = rendered("> [!NOTE]\n> Text.\n", {
      glyphs: { callouts: { note: <b>i</b> } },
    });

    expect(
      container.querySelector("b")?.closest(`.${slotClass("alert", "indicator")}`),
    ).not.toBeNull();
  });

  it("renders no indicator without an icon for the kind", () => {
    const { container } = rendered("> [!NOTE]\n> Text.\n");

    expect(container.querySelector(`.${slotClass("alert", "indicator")}`)).toBeNull();
  });

  it("titles a callout in the caller's words", () => {
    const { getByText } = rendered("> [!NOTE]\n> Text.\n", { calloutLabel: () => "Let op" });

    expect(getByText("Let op").tagName).toBe("SPAN");
  });
});
