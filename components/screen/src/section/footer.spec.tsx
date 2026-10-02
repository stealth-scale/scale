import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Footer } from "#section/footer.ts";
import { blocked } from "#section/section.fixtures.tsx";

describe("Footer", () => {
  it("renders a footer", () => {
    const { container } = render(blocked(<Footer>Billed monthly</Footer>));

    expect(slotElement(container, "section", "footer").tagName).toBe("FOOTER");
  });
});
