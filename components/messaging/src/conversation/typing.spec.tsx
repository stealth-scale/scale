import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#conversation/content.tsx";
import { Root } from "#conversation/root.tsx";
import { Typing } from "#conversation/typing.tsx";

/**
 * Renders a typing row inside a conversation's transcript.
 */
function typed(): ReturnType<typeof render> {
  return render(
    <Root>
      <Content>
        <Typing>Ada is typing</Typing>
      </Content>
    </Root>,
  );
}

describe("Typing", () => {
  it("renders a DIV for the typing slot with the caller's words", () => {
    const { container } = typed();
    const row = slotElement(container, "conversation", "typing");

    expect([row.tagName, row.textContent]).toStrictEqual(["DIV", "Ada is typing"]);
  });

  it("renders three dots hidden from a screen reader", () => {
    const { container } = typed();
    const dots = slotElement(container, "conversation", "dots");

    expect([dots.getAttribute("aria-hidden"), dots.children.length]).toStrictEqual(["true", 3]);
  });
});
