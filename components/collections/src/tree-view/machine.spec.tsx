import { type ReactElement } from "react";

import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import {
  labelId,
  splitTreeViewProps,
  type TreeViewOptions,
  useTreeViewMachine,
} from "#tree-view/machine.ts";
import { files } from "#tree-view/tree-view.fixtures.tsx";

/**
 * Runs the machine with the options the case sets and renders what it reports.
 *
 * @param props - The machine options.
 * @returns The expanded values and the label's ID, as text.
 */
function Running(props: TreeViewOptions): ReactElement {
  const api = useTreeViewMachine(props);

  return <span data-testid="state">{`${api.expandedValue.join(",")} ${labelId(api)}`}</span>;
}

describe("machine", () => {
  it("returns the machine's options first from splitTreeViewProps", () => {
    const [options] = splitTreeViewProps({ selectionMode: "multiple", typeahead: false });

    expect(options).toStrictEqual({ selectionMode: "multiple", typeahead: false });
  });

  it("returns the element's props second from splitTreeViewProps", () => {
    const [, rest] = splitTreeViewProps({ className: "mine", typeahead: false });

    expect(rest).toStrictEqual({ className: "mine" });
  });

  it("drops translations from the options splitTreeViewProps returns", () => {
    const [options] = splitTreeViewProps({ translations: { treeLabel: "Tree" }, typeahead: false });

    expect(options).toStrictEqual({ typeahead: false });
  });

  it("returns an api that reports the expanded branches", async () => {
    await drawn(<Running collection={files()} defaultExpandedValue={["src"]} id="files" />);

    expect(screen.getByTestId("state").textContent).toMatch(/^src /u);
  });

  it("returns the label's ID from labelId", async () => {
    await drawn(<Running collection={files()} id="files" />);

    expect(screen.getByTestId("state").textContent).toBe(" tree:files:label");
  });
});
