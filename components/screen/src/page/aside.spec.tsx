import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Aside } from "#page/aside.tsx";
import { paged } from "#page/page.fixtures.tsx";
import { SCROLLPORT } from "#page/recipe.ts";

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

  it("sets data-sticky when sticky", async () => {
    const { container } = await drawn(
      paged(
        <Aside aria-label="Contents" sticky>
          Events
        </Aside>,
      ),
    );

    expect(slotElement(container, "page", "aside").dataset["sticky"]).toBe("");
  });

  it("renders a sticky aside's content in a scroll area", async () => {
    const { container } = await drawn(
      paged(
        <Aside aria-label="Contents" sticky>
          Events
        </Aside>,
      ),
    );

    expect(slotElement(container, "page", "asideContent").textContent).toBe("Events");
  });

  it("names the scroll area's viewport by the aside's label", async () => {
    const { container } = await drawn(
      paged(
        <Aside aria-label="Contents" sticky>
          Events
        </Aside>,
      ),
    );

    expect(slotElement(container, "scroll-area", "viewport").getAttribute("aria-label")).toBe(
      "Contents",
    );
  });

  it("sets the window's height on a sticky aside", async () => {
    const { container } = await drawn(
      paged(
        <Aside aria-label="Contents" sticky>
          Events
        </Aside>,
      ),
    );

    expect(slotElement(container, "page", "aside").style.getPropertyValue(SCROLLPORT)).toBe(
      `${String(window.innerHeight)}px`,
    );
  });

  it("renders the content of an aside that does not stick without a scroll area", () => {
    const { container } = render(paged(<Aside aria-label="Activity">Events</Aside>));

    expect(container.querySelector(".scroll-area__root")).toBeNull();
  });

  it("sets no data-sticky by default", () => {
    const { container } = render(paged(<Aside aria-label="Activity">Events</Aside>));

    expect(slotElement(container, "page", "aside").dataset["sticky"]).toBeUndefined();
  });
});
