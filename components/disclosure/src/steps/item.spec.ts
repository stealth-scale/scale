import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { composed, itemed } from "#steps/steps.fixtures.tsx";

describe("Item", () => {
  it("renders a list item", async () => {
    await drawn(composed());

    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("drops the machine's aria-current", async () => {
    const { container } = await drawn(composed());

    expect(slotElement(container, "steps", "item").hasAttribute("aria-current")).toBe(false);
  });

  it("passes the element's props through", async () => {
    const { container } = await drawn(itemed(null));

    expect(slotElement(container, "steps", "item").tagName).toBe("LI");
  });
});
