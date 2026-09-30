import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#timeline/content.ts";
import { listed } from "#timeline/timeline.fixtures.tsx";
import { Title } from "#timeline/title.ts";

describe("Title", () => {
  it("renders a DIV for the title slot", () => {
    const { container } = render(
      listed(
        <Content>
          <Title>Settled</Title>
        </Content>,
      ),
    );

    expect(slotElement(container, "timeline", "title").tagName).toBe("DIV");
  });
});
