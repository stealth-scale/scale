import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Link } from "#toc/link.tsx";
import { composed, railed } from "#toc/toc.fixtures.tsx";

describe("Link", () => {
  it("draws an anchor inside the root it needs above it", async () => {
    await drawn(
      railed(
        <Link href="#sizes" item={{ depth: 2, value: "sizes" }}>
          Sizes
        </Link>,
      ),
    );

    expect(screen.getByRole("link", { name: "Sizes" }).getAttribute("href")).toBe("#sizes");
  });

  it("says it leads to the place on screen while its heading is", async () => {
    await drawn(composed({ defaultActiveIds: ["sizes"] }));

    expect(screen.getByRole("link", { name: "sizes" }).getAttribute("aria-current")).toBe(
      "location",
    );
  });

  it("says nothing while its heading is off screen", async () => {
    await drawn(composed({ defaultActiveIds: ["sizes"] }));

    expect(screen.getByRole("link", { name: "looks" }).getAttribute("aria-current")).toBeNull();
  });

  it("scrolls the container a caller names to the heading when pressed", async () => {
    const heading = document.createElement("h2");
    const box = document.createElement("div");

    heading.id = "looks";
    box.append(heading);
    document.body.append(box);

    const scrolled = { top: -1 };

    box.scrollTo = (options?: number | ScrollToOptions): void => {
      if (typeof options === "object") scrolled.top = options.top ?? -1;
    };

    await drawn(composed({ scrollEl: () => box }));

    fireEvent.click(screen.getByRole("link", { name: "looks" }));
    await settled();

    expect(scrolled.top).not.toBe(-1);

    box.remove();
  });

  it("draws the element as names", async () => {
    const { container } = await drawn(
      railed(
        <Link as="button" item={{ depth: 2, value: "sizes" }}>
          Sizes
        </Link>,
      ),
    );

    expect(slotElement(container, "toc", "link").tagName).toBe("BUTTON");
  });
});
