import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { filed } from "#attachment/attachment.fixtures.tsx";

describe("Description", () => {
  it("renders a SPAN for the description slot", () => {
    const { container } = render(filed());

    expect(slotElement(container, "attachment", "description").tagName).toBe("SPAN");
  });
});
