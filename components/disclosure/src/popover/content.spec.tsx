import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";
import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#popover/content.tsx";
import { composed, opened } from "#popover/popover.fixtures.tsx";

describe("Content", () => {
  it("renders a div", async () => {
    const { container } = await drawn(opened(<Content />));

    expect(slotElement(container, "popover", "content").tagName).toBe("DIV");
  });

  it("sets role dialog", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("sets aria-labelledby to the title's id", async () => {
    await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog").getAttribute("aria-labelledby")).toBe(
      screen.getByRole("heading", { name: "Filter the list" }).id,
    );
  });

  it("sets aria-describedby to the description's id", async () => {
    const { container } = await drawn(composed({ defaultOpen: true }));

    expect(screen.getByRole("dialog").getAttribute("aria-describedby")).toBe(
      slotElement(container, "popover", "description").id,
    );
  });

  it("renders the element as names", async () => {
    const { container } = await drawn(opened(<Content as="section" />));

    expect(slotElement(container, "popover", "content").tagName).toBe("SECTION");
  });
});
