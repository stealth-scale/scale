import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Avatar } from "#message/avatar.ts";
import { Root } from "#message/root.ts";

describe("Avatar", () => {
  it("renders a DIV for the avatar slot", () => {
    const { container } = render(
      <Root>
        <Avatar />
      </Root>,
    );

    expect(slotElement(container, "message", "avatar").tagName).toBe("DIV");
  });
});
