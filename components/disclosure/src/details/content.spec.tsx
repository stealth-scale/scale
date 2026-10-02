import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#details/content.ts";
import { inside } from "#details/details.fixtures.tsx";

describe("Content", () => {
  it("renders a div with the details' content class", () => {
    const { container } = render(inside(<Content>Refunds take 5 days.</Content>));

    expect(slotElement(container, "details", "content").tagName).toBe("DIV");
  });

  it("renders the element as names", () => {
    const { container } = render(inside(<Content as="section">Refunds take 5 days.</Content>));

    expect(slotElement(container, "details", "content").tagName).toBe("SECTION");
  });
});
