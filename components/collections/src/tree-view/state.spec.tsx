import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BranchText } from "#tree-view/branch-text.tsx";
import { Root } from "#tree-view/root.tsx";
import { files } from "#tree-view/tree-view.fixtures.tsx";

describe("state", () => {
  it("throws from useNode for a row part outside TreeView.Nodes", () => {
    expect(() =>
      render(
        <Root collection={files()}>
          <BranchText>src</BranchText>
        </Root>,
      ),
    ).toThrow("A part of TreeView.Nodes was drawn outside the root that holds it together.");
  });
});
