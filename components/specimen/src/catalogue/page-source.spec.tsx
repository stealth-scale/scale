import { type ReactElement } from "react";

import { describe, expect, it } from "vitest";

import { Card } from "@stealthscale/component-surfaces";
import { drawn, pressed } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Source } from "#catalogue/page-source.tsx";

const SOURCE = "export const sizes = { title: 'Sizes' };";

function staged(code: null | string): ReactElement {
  return (
    <Card.Root>
      <Card.Content>drawn</Card.Content>
      <Source code={code} title="Sizes" />
    </Card.Root>
  );
}

describe("Source", () => {
  it("holds a control named Source in the card's footer", async () => {
    const { container, getByRole } = await drawn(staged(SOURCE));

    expect(
      slotElement(container, "card", "footer").contains(getByRole("button", { name: "Source" })),
    ).toBe(true);
  });

  it("draws the control as the library's ghost button on the neutral palette", async () => {
    const { getByRole } = await drawn(staged(SOURCE));
    const control = getByRole("button", { name: "Source" });

    expect(control.classList.contains("button--ghost")).toBe(true);
    expect(control.classList.contains("button--neutral")).toBe(true);
  });

  it("keeps the source folded until the control is pressed", async () => {
    const { getByRole, queryByText } = await drawn(staged(SOURCE));

    expect(getByRole("button", { name: "Source" }).getAttribute("aria-expanded")).toBe("false");
    expect(queryByText(SOURCE)).toBeNull();
  });

  it("shows the source in the library's code block when the control is pressed", async () => {
    const { container, getByRole } = await drawn(staged(SOURCE));

    await pressed(getByRole("button", { name: "Source" }));

    expect(slotElement(container, "code-block", "code").textContent).toBe(SOURCE);
    expect(slotElement(container, "code-block", "title").textContent).toBe("Sizes");
  });

  it("points the control at the block it shows", async () => {
    const { container, getByRole } = await drawn(staged(SOURCE));

    await pressed(getByRole("button", { name: "Source" }));

    const control = getByRole("button", { name: "Source" });
    const shown = container.querySelector(`[id="${control.getAttribute("aria-controls") ?? ""}"]`);

    expect(control.getAttribute("aria-expanded")).toBe("true");
    expect(shown?.contains(slotElement(container, "code-block", "root"))).toBe(true);
  });

  it("hides the source again when the control is pressed once more", async () => {
    const { getByRole, queryByText } = await drawn(staged(SOURCE));

    await pressed(getByRole("button", { name: "Source" }));
    await pressed(getByRole("button", { name: "Source" }));

    expect(getByRole("button", { name: "Source" }).getAttribute("aria-expanded")).toBe("false");
    expect(queryByText(SOURCE)).toBeNull();
  });

  it("says the index cut no source for the scene where there is none", async () => {
    const { getByText, queryByRole } = await drawn(staged(null));

    expect(getByText("No source for this scene")).toBeDefined();
    expect(queryByRole("button")).toBeNull();
  });
});
