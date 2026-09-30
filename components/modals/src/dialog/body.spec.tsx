import { act } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Body } from "#dialog/body.tsx";
import { opened } from "#dialog/dialog.fixtures.tsx";
import { Title } from "#dialog/title.tsx";

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

    expect(slotElement(container, "dialog", "body").tagName).toBe("DIV");
  });

  it("applies its slot class", async () => {
    const { container } = await drawn(opened(<Body />));

    expect(slotElement(container, "dialog", "body").className).toContain("dialog__body");
  });

  it("renders the body inside a scroll area's content", async () => {
    const { container } = await drawn(opened(<Body>Terms</Body>));

    expect(slotElement(container, "dialog", "body").parentElement?.className).toContain(
      "scroll-area__content",
    );
  });

  it("renders the scroll area's root with the scroller slot class", async () => {
    const { container } = await drawn(opened(<Body>Terms</Body>));

    expect(slotElement(container, "dialog", "scroller").className).toContain("scroll-area__root");
  });

  it("names the viewport by the dialog's title", async () => {
    const { container } = await drawn(
      opened(
        <>
          <Title>Terms of service</Title>
          <Body>Terms</Body>
        </>,
      ),
    );

    await frame();

    expect(slotElement(container, "scroll-area", "viewport").getAttribute("aria-labelledby")).toBe(
      slotElement(container, "dialog", "title").id,
    );
  });

  it("leaves the viewport unnamed without a title", async () => {
    const { container } = await drawn(opened(<Body>Terms</Body>));

    await frame();

    expect(slotElement(container, "scroll-area", "viewport").hasAttribute("aria-labelledby")).toBe(
      false,
    );
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<Body as="section" />));

    expect(slotElement(container, "dialog", "body").tagName).toBe("SECTION");
  });
});
