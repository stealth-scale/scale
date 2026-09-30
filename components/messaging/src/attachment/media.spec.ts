import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { filed } from "#attachment/attachment.fixtures.tsx";

describe("Media", () => {
  it("renders a DIV for the media slot", () => {
    const { container } = render(filed());

    expect(slotElement(container, "attachment", "media").tagName).toBe("DIV");
  });
});
