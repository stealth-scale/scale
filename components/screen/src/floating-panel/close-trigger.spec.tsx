import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, opened } from "#floating-panel/floating-panel.fixtures.tsx";
import { CloseTrigger } from "#floating-panel/index.ts";

describe("CloseTrigger", () => {
  it("renders the library's button with the close trigger class", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect([...slotElement(container, "floating-panel", "closeTrigger").classList]).toContain(
      "button",
    );
  });

  it("names the button Close when label is absent", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("button", { name: "Close" })).toBeDefined();
  });

  it("takes its name from label", async () => {
    await drawn(opened(<CloseTrigger label="Schließen">x</CloseTrigger>));

    expect(screen.getByRole("button", { name: "Schließen" })).toBeDefined();
  });

  it("closes the panel on a press", async () => {
    await drawn(composed({ defaultOpen: true }));
    await pressed(screen.getByRole("button", { name: "Close" }));

    expect(screen.getByRole("button", { name: "Notes" }).getAttribute("aria-expanded")).toBe(
      "false",
    );
  });
});
