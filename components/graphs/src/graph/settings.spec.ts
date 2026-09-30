import { describe, expect, it } from "vitest";

import { FIT, MIN_ZOOM } from "#graph/fit.ts";
import { settingsOf } from "#graph/settings.ts";
import { EDGE_TYPES, NODE_TYPES } from "#graph/types.ts";

describe("settings", () => {
  it("renders the kit's node and edge types", () => {
    expect(settingsOf(false, {})).toMatchObject({ edgeTypes: EDGE_TYPES, nodeTypes: NODE_TYPES });
  });

  it("fits the view on the first render as the kit fits it", () => {
    expect(settingsOf(false, {})).toMatchObject({
      fitView: true,
      fitViewOptions: FIT,
      minZoom: MIN_ZOOM,
    });
  });

  it("puts the attribution in the bottom-start corner", () => {
    expect(settingsOf(false, {}).attributionPosition).toBe("bottom-left");
  });

  it("removes the selection on Backspace and Delete while the canvas takes edits", () => {
    expect(settingsOf(false, {}).deleteKeyCode).toStrictEqual(["Backspace", "Delete"]);
  });

  it("turns off every edit while the canvas is read-only", () => {
    expect(settingsOf(true, {})).toMatchObject({
      deleteKeyCode: null,
      disableKeyboardA11y: true,
      edgesFocusable: false,
      elementsSelectable: false,
      nodesConnectable: false,
      nodesDraggable: false,
    });
  });

  it("describes each node by the caller's words while the canvas takes edits", () => {
    const words = settingsOf(false, { nodeDescription: "Press Enter to open the step." });

    expect(words.ariaLabelConfig?.["node.a11yDescription.default"]).toBe(
      "Press Enter to open the step.",
    );
  });

  it("describes no node while the canvas is read-only", () => {
    expect(settingsOf(true, {}).ariaLabelConfig?.["node.a11yDescription.default"]).toBe("");
  });
});
