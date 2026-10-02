import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { opened } from "#dialog/dialog.fixtures.tsx";
import { Footer } from "#dialog/footer.ts";

describe("Footer", () => {
  it("renders a div", async () => {
    const { container } = await drawn(opened(<Footer />));

    expect(slotElement(container, "dialog", "footer").tagName).toBe("DIV");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<Footer />));

    expect(slotElement(container, "dialog", "footer").className).toContain("dialog__footer");
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<Footer as="footer" />));

    expect(slotElement(container, "dialog", "footer").tagName).toBe("FOOTER");
  });
});
