import { act } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Body } from "#drawer/body.tsx";
import { opened } from "#drawer/drawer.fixtures.tsx";
import { Title } from "#drawer/title.tsx";

/**
 * Waits for the next animation frame, in which the machine checks which parts rendered.
 */
async function frame(): Promise<void> {
  await act(async () => {
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve();
      });
    });
    await Promise.resolve();
  });
}

describe("Body", () => {
  it("renders a div", async () => {
    const { container } = await drawn(opened(<Body />));

    expect(slotElement(container, "drawer", "body").tagName).toBe("DIV");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<Body />));

    expect(slotElement(container, "drawer", "body").className).toContain("drawer__body");
  });

  it("renders the body inside a scroll area's content", async () => {
    const { container } = await drawn(opened(<Body>Invoices</Body>));

    expect(slotElement(container, "drawer", "body").parentElement?.className).toContain(
      "scroll-area__content",
    );
  });

  it("renders the scroll area's root with the scroller slot class", async () => {
    const { container } = await drawn(opened(<Body>Invoices</Body>));

    expect(slotElement(container, "drawer", "scroller").className).toContain("scroll-area__root");
  });

  it("names the viewport by the drawer's title", async () => {
    const { container } = await drawn(
      opened(
        <>
          <Title>Invoices</Title>
          <Body>Invoices</Body>
        </>,
      ),
    );

    await frame();

    expect(slotElement(container, "scroll-area", "viewport").getAttribute("aria-labelledby")).toBe(
      slotElement(container, "drawer", "title").id,
    );
  });

  it("leaves the viewport unnamed without a title", async () => {
    const { container } = await drawn(opened(<Body>Invoices</Body>));

    await frame();

    expect(slotElement(container, "scroll-area", "viewport").hasAttribute("aria-labelledby")).toBe(
      false,
    );
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<Body as="section" />));

    expect(slotElement(container, "drawer", "body").tagName).toBe("SECTION");
  });
});
