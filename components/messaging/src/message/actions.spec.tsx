import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Actions } from "#message/actions.ts";
import { inTurn } from "#message/message.fixtures.tsx";

describe("Actions", () => {
  it("renders a DIV for the actions slot", () => {
    const { container } = render(inTurn(<Actions />));

    expect(slotElement(container, "message", "actions").tagName).toBe("DIV");
  });
});
