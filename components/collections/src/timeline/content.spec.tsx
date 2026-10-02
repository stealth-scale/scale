import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#timeline/content.ts";
import { listed } from "#timeline/timeline.fixtures.tsx";

describe("Content", () => {
  it("renders a DIV for the content slot", () => {
    const { container } = render(listed(<Content />));

    expect(slotElement(container, "timeline", "content").tagName).toBe("DIV");
  });
});
