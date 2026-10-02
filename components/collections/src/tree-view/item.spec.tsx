import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, pressed } from "@stealthscale/testing-react";

import { ItemText } from "#tree-view/item-text.tsx";
import { Item } from "#tree-view/item.tsx";
import { Nodes } from "#tree-view/nodes.tsx";
import { Root } from "#tree-view/root.tsx";
import { composed, files } from "#tree-view/tree-view.fixtures.tsx";
import { Tree } from "#tree-view/tree.tsx";

describe("Item", () => {
  it("renders a div with the treeitem role", async () => {
    await drawn(composed());

    expect(screen.getByRole("treeitem", { name: "readme.md" }).tagName).toBe("DIV");
  });

  it("selects the item on a press", async () => {
    await drawn(composed());
    await pressed(screen.getByRole("treeitem", { name: "readme.md" }));

    expect(screen.getByRole("treeitem", { name: "readme.md" }).getAttribute("aria-selected")).toBe(
      "true",
    );
  });

  it("drops the machine's aria-current from a selected item", async () => {
    await drawn(composed({ defaultSelectedValue: ["readme.md"] }));

    expect(screen.getByRole("treeitem", { name: "readme.md" }).hasAttribute("aria-current")).toBe(
      false,
    );
  });

  it("renders an a with the address href gives", async () => {
    await drawn(
      <Root collection={files()}>
        <Tree aria-label="Pages">
          <Nodes
            render={() => (
              <Item href="#readme">
                <ItemText>Readme</ItemText>
              </Item>
            )}
          />
        </Tree>
      </Root>,
    );

    const link = screen.getAllByRole("treeitem")[0];

    expect([link?.tagName, link?.getAttribute("href")]).toStrictEqual(["A", "#readme"]);
  });
});
