import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#timeline/content.ts";
import { Description } from "#timeline/description.ts";
import { listed } from "#timeline/timeline.fixtures.tsx";

describe("Description", () => {
  it("renders a DIV for the description slot", () => {
    const { container } = render(
      listed(
        <Content>
          <Description>Friday</Description>
        </Content>,
      ),
    );

    expect(slotElement(container, "timeline", "description").tagName).toBe("DIV");
  });
});
