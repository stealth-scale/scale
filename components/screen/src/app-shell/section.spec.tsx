import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { shell } from "#app-shell/app-shell.fixtures.tsx";
import { Section } from "#app-shell/section.tsx";

describe("Section", () => {
  it("renders a div inside the root", () => {
    const { container } = render(shell(<Section>Channels</Section>));

    expect(slotElement(container, "app-shell", "section").tagName).toBe("DIV");
  });

  it("writes data-grows when grows is passed", () => {
    const { container } = render(shell(<Section grows>Channels</Section>));

    expect(slotElement(container, "app-shell", "section").dataset["grows"]).toBe("");
  });

  it("omits data-grows without grows", () => {
    const { container } = render(shell(<Section>Channels</Section>));

    expect(slotElement(container, "app-shell", "section").dataset["grows"]).toBeUndefined();
  });

  it("renders the band inside a scroll area's content when scrolls is passed", () => {
    const { container } = render(shell(<Section scrolls>Channels</Section>));

    expect(slotElement(container, "app-shell", "section").parentElement?.className).toContain(
      "scroll-area__content",
    );
  });

  it("renders the element as names when the band scrolls", () => {
    const { container } = render(
      shell(
        <Section as="nav" scrolls>
          Channels
        </Section>,
      ),
    );

    expect(slotElement(container, "app-shell", "section").tagName).toBe("NAV");
  });

  it("renders no scroll area without scrolls", () => {
    const { container } = render(shell(<Section>Channels</Section>));

    expect(container.querySelector(".scroll-area__root")).toBeNull();
  });

  it("writes data-grows on the scroll area's root when the band grows and scrolls", () => {
    const { container } = render(
      shell(
        <Section grows scrolls>
          Channels
        </Section>,
      ),
    );

    expect(slotElement(container, "app-shell", "scroller").dataset["grows"]).toBe("");
  });

  it("keeps the viewport of a band that scrolls out of the tab order", () => {
    const { container } = render(shell(<Section scrolls>Channels</Section>));

    expect(slotElement(container, "scroll-area", "viewport").tabIndex).toBe(-1);
  });
});
