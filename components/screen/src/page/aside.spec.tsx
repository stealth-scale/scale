import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Aside } from "#page/aside.tsx";
import { paged } from "#page/page.fixtures.tsx";

describe("Aside", () => {
  it("draws an aside inside the column it needs above it", () => {
    const { container } = render(paged(<Aside aria-label="Activity">Events</Aside>));

    expect(slotElement(container, "page", "aside").tagName).toBe("ASIDE");
  });

  it("is a landmark a reader can name and jump to", () => {
    render(paged(<Aside aria-label="Activity">Events</Aside>));

    expect(screen.getByRole("complementary", { name: "Activity" })).toBeTruthy();
  });

  it("stacks under the body on a narrow page where nothing else is asked for", () => {
    const { container } = render(paged(<Aside aria-label="Activity">Events</Aside>));

    expect(slotElement(container, "page", "aside").dataset["folds"]).toBe("under");
  });

  it("leaves a narrow page where it is told to", () => {
    const { container } = render(
      paged(
        <Aside aria-label="Contents" folds="hide">
          Events
        </Aside>,
      ),
    );

    expect(slotElement(container, "page", "aside").dataset["folds"]).toBe("hide");
  });

  it("stays put where a caller asks", () => {
    const { container } = render(
      paged(
        <Aside aria-label="Contents" sticky>
          Events
        </Aside>,
      ),
    );

    expect(slotElement(container, "page", "aside").dataset["sticky"]).toBe("");
  });

  it("scrolls with the page where nothing says otherwise", () => {
    const { container } = render(paged(<Aside aria-label="Activity">Events</Aside>));

    expect(slotElement(container, "page", "aside").dataset["sticky"]).toBeUndefined();
  });
});
