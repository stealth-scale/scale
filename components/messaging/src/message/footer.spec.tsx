import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Footer } from "#message/footer.ts";
import { inTurn } from "#message/message.fixtures.tsx";

describe("Footer", () => {
  it("renders a DIV for the footer slot", () => {
    const { container } = render(inTurn(<Footer>Read</Footer>));

    expect(slotElement(container, "message", "footer").tagName).toBe("DIV");
  });
});
