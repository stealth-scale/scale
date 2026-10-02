import { fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, field, framed } from "#tags-input/tags-input.fixtures.tsx";

describe("Control", () => {
  it("renders a div around the tags and the input", async () => {
    const { container } = await drawn(composed());
    const control = slotElement(container, "tags-input", "control");

    expect([control.tagName, control.contains(field())]).toStrictEqual(["DIV", true]);
  });

  it("focuses the input on a press outside a tag", async () => {
    const { container } = await drawn(composed());

    fireEvent.pointerDown(slotElement(container, "tags-input", "control"));
    await settled();
    await framed();

    expect(document.activeElement).toBe(field());
  });

  it("leaves a read-only control out of the tab order", async () => {
    const { container } = await drawn(composed({ readOnly: true }));

    expect(slotElement(container, "tags-input", "control").getAttribute("tabindex")).toBeNull();
  });
});
