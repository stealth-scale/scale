import { describe, expect, it } from "vitest";

import { ariaWordsOf, edgeNameOf, moveAnnouncementOf, removeNameOf } from "#graph/words.ts";

describe("words", () => {
  it("describes the keys a node of an editable canvas takes", () => {
    expect(ariaWordsOf({}, true)["node.a11yDescription.keyboardDisabled"]).toBe(
      "Press Enter or Space to select the node, the arrow keys to move it, Delete to remove it and Escape to clear the selection.",
    );
  });

  it("describes a node the same whether React Flow's keys are on or off", () => {
    const words = ariaWordsOf({}, true);

    expect(words["node.a11yDescription.default"]).toBe(
      words["node.a11yDescription.keyboardDisabled"],
    );
  });

  it("describes the keys an edge of an editable canvas takes", () => {
    expect(ariaWordsOf({}, true)["edge.a11yDescription.default"]).toBe(
      "Press Enter or Space to select the connection, Delete to remove it and Escape to clear the selection.",
    );
  });

  it("describes nothing on a read-only canvas", () => {
    const words = ariaWordsOf({ edgeDescription: "Edge", nodeDescription: "Node" }, false);

    expect([
      words["node.a11yDescription.default"],
      words["node.a11yDescription.keyboardDisabled"],
      words["edge.a11yDescription.default"],
    ]).toStrictEqual(["", "", ""]);
  });

  it("takes the caller's descriptions on an editable canvas", () => {
    const words = ariaWordsOf({ edgeDescription: "Edge", nodeDescription: "Node" }, true);

    expect([
      words["node.a11yDescription.default"],
      words["edge.a11yDescription.default"],
    ]).toStrictEqual(["Node", "Edge"]);
  });

  it("announces the direction of a move", () => {
    expect(
      ariaWordsOf({}, true)["node.a11yDescription.ariaLiveMessage"]?.({
        direction: "up",
        x: 40,
        y: 12,
      }),
    ).toBe("Moved the selected node up.");
  });

  it("announces a move by its direction", () => {
    expect(moveAnnouncementOf({ direction: "down", x: 0, y: 0 })).toBe(
      "Moved the selected node down.",
    );
  });

  it("names an edge by its ends", () => {
    expect(edgeNameOf({ source: "Orders", target: "Clean orders" })).toBe("Orders to Clean orders");
  });

  it("names an edge's remove control by the edge's ends", () => {
    expect(removeNameOf({ source: "Orders", target: "Clean orders" })).toBe(
      "Remove the connection from Orders to Clean orders",
    );
  });

  it("announces a move in the caller's words", () => {
    const words = ariaWordsOf({ moveAnnouncement: ({ direction }) => `Moved ${direction}` }, true);

    expect(words["node.a11yDescription.ariaLiveMessage"]?.({ direction: "left", x: 0, y: 0 })).toBe(
      "Moved left",
    );
  });
});
