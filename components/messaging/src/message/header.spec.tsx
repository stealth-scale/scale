import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Header } from "#message/header.ts";
import { inTurn } from "#message/message.fixtures.tsx";

describe("Header", () => {
  it("renders a DIV for the header slot", () => {
    const { container } = render(inTurn(<Header>Ada Okafor</Header>));

    expect(slotElement(container, "message", "header").tagName).toBe("DIV");
  });
});
