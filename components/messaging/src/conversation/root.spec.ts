import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations, violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { pressed, transcript } from "#conversation/conversation.fixtures.tsx";
import { Root } from "#conversation/root.tsx";

describe("Root", () => {
  it("returns no conformance violation for its DIV root", () => {
    expect(violations(Root, { children: true, element: "DIV" })).toStrictEqual([]);
  });

  it("returns no accessibility violation for a transcript", async () => {
    await expect(
      accessibilityViolations(() => transcript(), { frame: true }),
    ).resolves.toStrictEqual([]);
  });

  it("renders the scroll area's root with the conversation's root class", () => {
    const { container } = render(transcript());

    expect(slotElement(container, "conversation", "root").classList).toContain("scroll-area__root");
  });

  it("renders the vertical bar after its children", () => {
    const { container } = render(transcript());

    expect(slotElement(container, "conversation", "root").lastElementChild?.className).toContain(
      "scroll-area__scrollbar",
    );
  });

  it("reads the view's place from the engine conversation passes", () => {
    render(transcript());
    pressed("First");

    expect(screen.getByRole("button", { name: "Jump to the latest message" })).toBeDefined();
  });

  it("runs its own engine when conversation is absent", () => {
    render(transcript({ owned: true }));
    pressed("First");

    expect(screen.queryByRole("button", { name: "Jump to the latest message" })).toBeNull();
  });
});
