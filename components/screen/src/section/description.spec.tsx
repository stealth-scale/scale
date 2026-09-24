import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Description } from "#section/description.ts";
import { blocked } from "#section/section.fixtures.tsx";

describe("Description", () => {
  it("renders a p", () => {
    const { container } = render(blocked(<Description>What this pays for.</Description>));

    expect(slotElement(container, "section", "description").tagName).toBe("P");
  });
});
