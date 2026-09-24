import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Banner } from "#page/banner.ts";
import { paged } from "#page/page.fixtures.tsx";

describe("Banner", () => {
  it("renders a div", () => {
    const { container } = render(paged(<Banner>Your trial ends on Friday</Banner>));

    expect(slotElement(container, "page", "banner").tagName).toBe("DIV");
  });

  it("sets no role", () => {
    render(paged(<Banner>Your trial ends on Friday</Banner>));

    expect(screen.queryByRole("alert")).toBeNull();
  });
});
