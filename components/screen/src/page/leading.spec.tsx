import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Leading } from "#page/leading.ts";
import { paged } from "#page/page.fixtures.tsx";

describe("Leading", () => {
  it("renders a div", () => {
    const { container } = render(paged(<Leading>A</Leading>));

    expect(slotElement(container, "page", "leading").tagName).toBe("DIV");
  });
});
