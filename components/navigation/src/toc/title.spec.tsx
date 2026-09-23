import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Title } from "#toc/title.tsx";
import { railed } from "#toc/toc.fixtures.tsx";

describe("Title", () => {
  it("renders a div inside the root", async () => {
    const { container } = await drawn(railed(<Title>On this page</Title>));

    expect(slotElement(container, "toc", "title").tagName).toBe("DIV");
  });

  it("sets the id that aria-labelledby on the root references", async () => {
    const { container } = await drawn(railed(<Title>On this page</Title>));
    const title = slotElement(container, "toc", "title");

    expect(slotElement(container, "toc", "root").getAttribute("aria-labelledby")).toBe(title.id);
  });

  it("renders the element passed as as", async () => {
    const { container } = await drawn(railed(<Title as="h2">On this page</Title>));

    expect(slotElement(container, "toc", "title").tagName).toBe("H2");
  });
});
