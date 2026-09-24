import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { paged } from "#page/page.fixtures.tsx";
import { Palette } from "#page/palette.ts";

describe("Palette", () => {
  it("renders a div", () => {
    const { container } = render(paged(<Palette>The rest</Palette>));

    expect(slotElement(container, "page", "palette").tagName).toBe("DIV");
  });
});
