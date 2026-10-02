import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { inTurn } from "#message/message.fixtures.tsx";

describe("Content", () => {
  it("renders a DIV for the content slot", () => {
    const { container } = render(inTurn(null));

    expect(slotElement(container, "message", "content").tagName).toBe("DIV");
  });
});
