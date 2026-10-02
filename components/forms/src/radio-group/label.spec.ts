import { act, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed } from "#radio-group/radio-group.fixtures.tsx";

describe("Label", () => {
  it("renders a span inside the root", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "radio-group", "label").tagName).toBe("SPAN");
  });

  it("labels the group through aria-labelledby", async () => {
    const { container } = await drawn(composed());

    expect(screen.getByRole("radiogroup").getAttribute("aria-labelledby")).toBe(
      slotElement(container, "radio-group", "label").id,
    );
  });

  it("removes the group's aria-labelledby when it unmounts", async () => {
    const { rerender } = await drawn(composed());

    await act(async () => {
      rerender(composed({}, { labelled: false }));
      await Promise.resolve();
    });

    expect(screen.getByRole("radiogroup").getAttribute("aria-labelledby")).toBeNull();
  });

  it("sets data-disabled on a disabled group", async () => {
    const { container } = await drawn(composed({ disabled: true }));

    expect(slotElement(container, "radio-group", "label").dataset["disabled"]).toBe("");
  });
});
