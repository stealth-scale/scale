import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { picked, trigger } from "#select/select.fixtures.tsx";

describe("Label", () => {
  it("renders a label", async () => {
    const { container } = await drawn(picked());

    expect(slotElement(container, "select", "label").tagName).toBe("LABEL");
  });

  it("points at the hidden select", async () => {
    const { container } = await drawn(picked());

    expect(slotElement(container, "select", "label").getAttribute("for")).toBe(
      container.querySelector("select")?.id,
    );
  });

  it("names the trigger while it is mounted", async () => {
    await drawn(picked());

    expect(trigger().getAttribute("aria-labelledby")).toBe(screen.getByText("Account").id);
  });

  it("moves focus to the trigger when pressed", async () => {
    await drawn(picked());

    fireEvent.click(screen.getByText("Account"));
    await settled();

    expect(document.activeElement).toBe(trigger());
  });
});
