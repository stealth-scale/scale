import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Title } from "#toc/title.tsx";
import { railed } from "#toc/toc.fixtures.tsx";

describe("Title", () => {
  it("draws a div inside the root it needs above it", async () => {
    const { container } = await drawn(railed(<Title>On this page</Title>));

    expect(slotElement(container, "toc", "title").tagName).toBe("DIV");
  });

  it("carries the id the landmark names itself by", async () => {
    const { container } = await drawn(railed(<Title>On this page</Title>));
    const title = slotElement(container, "toc", "title");

    expect(slotElement(container, "toc", "root").getAttribute("aria-labelledby")).toBe(title.id);
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(railed(<Title as="h2">On this page</Title>));

    expect(slotElement(container, "toc", "title").tagName).toBe("H2");
  });
});
