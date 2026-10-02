import { describe, expect, expectTypeOf, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content, type ContentProps } from "#sidebar/content.ts";
import { aside } from "#sidebar/sidebar.fixtures.tsx";

describe("Content", () => {
  it("renders a div inside the root", async () => {
    const { container } = await drawn(aside(<Content />));

    expect(slotElement(container, "sidebar", "content").tagName).toBe("DIV");
  });

  it("renders its children", async () => {
    const { container } = await drawn(
      aside(
        <Content>
          <a href="/invoices">Invoices</a>
        </Content>,
      ),
    );

    expect(slotElement(container, "sidebar", "content").textContent).toBe("Invoices");
  });

  it("renders its children inside the scroll area's viewport", async () => {
    const { container } = await drawn(aside(<Content />));

    expect(slotElement(container, "sidebar", "content").parentElement?.className).toContain(
      "scroll-area__viewport",
    );
  });

  it("fills the column with the scroll area's root", async () => {
    const { container } = await drawn(aside(<Content />));

    expect(slotElement(container, "sidebar", "scroller").className).toContain("scroll-area__root");
  });

  it("keeps the viewport out of the tab order", async () => {
    const { container } = await drawn(aside(<Content />));

    expect(slotElement(container, "scroll-area", "viewport").tabIndex).toBe(-1);
  });

  it("renders a vertical bar", async () => {
    const { container } = await drawn(aside(<Content />));

    expect(slotElement(container, "scroll-area", "scrollbar").dataset["orientation"]).toBe(
      "vertical",
    );
  });

  it("omits as from its props", () => {
    expectTypeOf<ContentProps>().not.toHaveProperty("as");
    expect(Content).toBeDefined();
  });
});
