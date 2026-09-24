import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Aside } from "#page/aside.tsx";
import { paged } from "#page/page.fixtures.tsx";

describe("Aside", () => {
  it("renders an aside", () => {
    const { container } = render(paged(<Aside aria-label="Activity">Events</Aside>));

    expect(slotElement(container, "page", "aside").tagName).toBe("ASIDE");
  });

  it("sets role complementary named by aria-label", () => {
    render(paged(<Aside aria-label="Activity">Events</Aside>));

    expect(screen.getByRole("complementary", { name: "Activity" })).toBeTruthy();
  });

  it("defaults data-folds to under", () => {
    const { container } = render(paged(<Aside aria-label="Activity">Events</Aside>));

    expect(slotElement(container, "page", "aside").dataset["folds"]).toBe("under");
  });

  it("sets data-folds hide", () => {
    const { container } = render(
      paged(
        <Aside aria-label="Contents" folds="hide">
          Events
        </Aside>,
      ),
    );

    expect(slotElement(container, "page", "aside").dataset["folds"]).toBe("hide");
  });

  it("sets data-sticky when sticky", () => {
    const { container } = render(
      paged(
        <Aside aria-label="Contents" sticky>
          Events
        </Aside>,
      ),
    );

    expect(slotElement(container, "page", "aside").dataset["sticky"]).toBe("");
  });

  it("sets no data-sticky by default", () => {
    const { container } = render(paged(<Aside aria-label="Activity">Events</Aside>));

    expect(slotElement(container, "page", "aside").dataset["sticky"]).toBeUndefined();
  });
});
