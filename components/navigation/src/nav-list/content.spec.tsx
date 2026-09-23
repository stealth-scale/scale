import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Content } from "#nav-list/content.tsx";
import { Item } from "#nav-list/item.ts";
import { Link } from "#nav-list/link.ts";
import { branched } from "#nav-list/nav-list.fixtures.tsx";

describe("Content", () => {
  it("renders a UL element inside a branch", () => {
    const { container } = render(branched(<Content>rows</Content>));

    expect(slotElement(container, "nav-list", "content").tagName).toBe("UL");
  });

  it("sets hidden while the branch is closed", () => {
    const { container } = render(branched(<Content>rows</Content>));

    expect(slotElement(container, "nav-list", "content").hidden).toBe(true);
  });

  it("clears hidden while the branch is open", () => {
    const { container } = render(branched(<Content>rows</Content>, { defaultOpen: true }));

    expect(slotElement(container, "nav-list", "content").hidden).toBe(false);
  });

  it("removes a nested link from the accessibility tree while the branch is closed", () => {
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

  it("sets the id the machine builds from the branch id", () => {
    const { container } = render(branched(<Content>rows</Content>, { id: "settings-rows" }));

    expect(slotElement(container, "nav-list", "content").id).toBe(
      "collapsible:settings-rows:content",
    );
  });
});
