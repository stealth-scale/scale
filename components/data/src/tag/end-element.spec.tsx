import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { EndElement } from "#tag/end-element.ts";
import { tagged } from "#tag/tag.fixtures.tsx";

describe("EndElement", () => {
  it("renders a SPAN for the end element slot", () => {
    const { container } = render(
      tagged(
        <EndElement>
          <svg aria-hidden />
        </EndElement>,
      ),
    );

    expect(slotElement(container, "tag", "endElement").tagName).toBe("SPAN");
  });
});
