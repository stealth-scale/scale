import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { filed } from "#attachment/attachment.fixtures.tsx";

describe("Title", () => {
  it("renders a SPAN for the title slot", () => {
    const { container } = render(filed());

    expect(slotElement(container, "attachment", "title").tagName).toBe("SPAN");
  });
});
