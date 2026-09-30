import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { filed } from "#attachment/attachment.fixtures.tsx";

describe("Content", () => {
  it("renders a DIV for the content slot", () => {
    const { container } = render(filed());

    expect(slotElement(container, "attachment", "content").tagName).toBe("DIV");
  });
});
