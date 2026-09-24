import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Footer } from "#page/footer.tsx";
import { paged } from "#page/page.fixtures.tsx";

describe("Footer", () => {
  it("renders a footer", () => {
    const { container } = render(paged(<Footer>Paid on 3 May</Footer>));

    expect(slotElement(container, "page", "footer").tagName).toBe("FOOTER");
  });

  it("sets data-sticky when sticky", () => {
    const { container } = render(paged(<Footer sticky>Paid on 3 May</Footer>));

    expect(slotElement(container, "page", "footer").dataset["sticky"]).toBe("");
  });
});
