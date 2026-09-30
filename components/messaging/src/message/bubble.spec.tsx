import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { violations } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Bubble } from "#message/bubble.tsx";
import { inTurn } from "#message/message.fixtures.tsx";

describe("Bubble", () => {
  it("returns no conformance violation for its DIV", () => {
    expect(
      violations(Bubble, {
        as: true,
        children: true,
        element: "DIV",
        subject: (container) => slotElement(container, "message", "bubble"),
        wrapper: (children) => inTurn(children),
      }),
    ).toStrictEqual([]);
  });

  it("writes data-failed while failed", () => {
    const { container } = render(inTurn(<Bubble failed>Sent twice?</Bubble>));

    expect(slotElement(container, "message", "bubble").dataset["failed"]).toBe("");
  });

  it("leaves data-failed off unless failed", () => {
    const { container } = render(inTurn(<Bubble>Sent</Bubble>));

    expect(slotElement(container, "message", "bubble").dataset["failed"]).toBeUndefined();
  });
});
