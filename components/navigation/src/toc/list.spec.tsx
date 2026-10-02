import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { List } from "#toc/list.tsx";
import { railed } from "#toc/toc.fixtures.tsx";

describe("List", () => {
  it("renders an unordered list inside the root", async () => {
    await drawn(railed(<List />));

    expect(screen.getByRole("list").tagName).toBe("UL");
  });

  it("sets the id the machine measures the rows against", async () => {
    const { container } = await drawn(railed(<List />));

    expect(slotElement(container, "toc", "list").id).toMatch(/^toc:.+:list$/u);
  });

  it("renders the element passed as as", async () => {
    const { container } = await drawn(railed(<List as="ol" />));

    expect(slotElement(container, "toc", "list").tagName).toBe("OL");
  });
});
