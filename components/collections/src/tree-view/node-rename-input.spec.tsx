import { act, fireEvent, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { ItemText } from "#tree-view/item-text.tsx";
import { Item } from "#tree-view/item.tsx";
import { NodeRenameInput } from "#tree-view/node-rename-input.tsx";
import { Nodes } from "#tree-view/nodes.tsx";
import { Root } from "#tree-view/root.tsx";
import { composed, files } from "#tree-view/tree-view.fixtures.tsx";
import { Tree } from "#tree-view/tree.tsx";

/**
 * Focuses the row named by the text given and presses F2 on it.
 *
 * @param name - The row's text.
 */
async function renaming(name: string): Promise<void> {
  const target = screen.getByRole("treeitem", { name });

  act(() => {
    target.focus();
  });
  fireEvent.keyDown(target, { key: "F2" });
  await settled();
}

describe("NodeRenameInput", () => {
  it("hides the field while its node is not renamed", async () => {
    await drawn(composed({ canRename: () => true }));

    expect(screen.getAllByLabelText("Rename", { selector: "input" })[1]?.hidden).toBe(true);
  });

  it("opens with the node's text on F2", async () => {
    await drawn(composed({ canRename: () => true }));
    await renaming("readme.md");

    expect(screen.getByDisplayValue("readme.md").hidden).toBe(false);
  });

  it("submits the typed name on Enter", async () => {
    const told = vi.fn<(details: { readonly label: string }) => void>();

    await drawn(composed({ canRename: () => true, onRenameComplete: told }));
    await renaming("readme.md");

    const input = screen.getByDisplayValue("readme.md");

    fireEvent.change(input, { target: { value: "notes.md" } });
    fireEvent.keyDown(input, { key: "Enter" });
    await settled();

    expect(told).toHaveBeenLastCalledWith(expect.objectContaining({ label: "notes.md" }));
  });

  it("cancels the rename on Escape", async () => {
    const told = vi.fn<(details: { readonly label: string }) => void>();

    await drawn(composed({ canRename: () => true, onRenameComplete: told }));
    await renaming("readme.md");
    fireEvent.keyDown(screen.getByDisplayValue("readme.md"), { key: "Escape" });
    await settled();

    expect(told).not.toHaveBeenCalled();
  });

  it("takes the name label gives", async () => {
    await drawn(
      <Root collection={files()}>
        <Tree aria-label="Files">
          <Nodes
            render={() => (
              <Item>
                <ItemText>Readme</ItemText>
                <NodeRenameInput label="Umbenennen" />
              </Item>
            )}
          />
        </Tree>
      </Root>,
    );

    expect(screen.getAllByLabelText("Umbenennen", { selector: "input" })).toHaveLength(3);
  });
});
