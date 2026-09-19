import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#nav-list/content.tsx";
import { Item } from "#nav-list/item.ts";
import { Link } from "#nav-list/link.ts";
import { branched } from "#nav-list/nav-list.fixtures.tsx";

describe("Content", () => {
  it("draws a list inside the branch it needs above it", () => {
    const { container } = render(branched(<Content>rows</Content>));

    expect(slotElement(container, "nav-list", "content").tagName).toBe("UL");
  });

  it("hides the list while the branch is closed", () => {
    const { container } = render(branched(<Content>rows</Content>));

    expect(slotElement(container, "nav-list", "content").hidden).toBe(true);
  });

  it("shows the list while the branch is open", () => {
    const { container } = render(branched(<Content>rows</Content>, { defaultOpen: true }));

    expect(slotElement(container, "nav-list", "content").hidden).toBe(false);
  });

  it("takes a destination inside a closed branch out of reach", () => {
    render(
      branched(
        <Content>
          <Item>
            <Link href="/settings/team">Team</Link>
          </Item>
        </Content>,
      ),
    );

    expect(screen.queryByRole("link", { name: "Team" })).toBeNull();
  });

  it("carries the identifier the machine builds from the id a caller names", () => {
    const { container } = render(branched(<Content>rows</Content>, { id: "settings-rows" }));

    expect(slotElement(container, "nav-list", "content").id).toBe(
      "collapsible:settings-rows:content",
    );
  });
});
