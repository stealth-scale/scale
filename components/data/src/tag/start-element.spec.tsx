import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { StartElement } from "#tag/start-element.ts";
import { tagged } from "#tag/tag.fixtures.tsx";

describe("StartElement", () => {
  it("renders a SPAN for the start element slot", () => {
    const { container } = render(
      tagged(
        <StartElement>
          <svg aria-hidden />
        </StartElement>,
      ),
    );

    expect(slotElement(container, "tag", "startElement").tagName).toBe("SPAN");
  });
});
