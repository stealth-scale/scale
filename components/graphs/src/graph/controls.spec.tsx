import { act, fireEvent } from "@testing-library/react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { variantClass } from "@stealthscale/testing-theme";

import { drawn, SELECTED, settled } from "#graph/graph.fixtures.tsx";
import * as Graph from "#graph/index.ts";

const BAR = (
  <Graph.Controls>
    <Graph.Control action="zoomIn" label="Zoom in">
      <PlusIcon />
    </Graph.Control>
    <Graph.Control action="zoomOut" label="Zoom out">
      <MinusIcon />
    </Graph.Control>
  </Graph.Controls>
);

describe("Controls", () => {
  it("renders a toolbar named Canvas unless labelled", async () => {
    const { getByRole } = await drawn({}, BAR);

    expect(getByRole("toolbar", { name: "Canvas" })).toBeDefined();
  });

  it("names the toolbar by label", async () => {
    const { getByRole } = await drawn(
      {},
      <Graph.Controls label="Pipeline view">
        <Graph.Control action="fit" label="Fit">
          <PlusIcon />
        </Graph.Control>
      </Graph.Controls>,
    );

    expect(getByRole("toolbar", { name: "Pipeline view" })).toBeDefined();
  });

  it("renders its buttons at the small size", async () => {
    const { getByRole } = await drawn({}, BAR);

    expect(getByRole("button", { name: "Zoom in" }).classList).toContain(
      variantClass("button", "size", "sm"),
    );
  });

  it("renders its buttons in the ghost look", async () => {
    const { getByRole } = await drawn({}, BAR);

    expect(getByRole("button", { name: "Zoom in" }).classList).toContain(
      variantClass("button", "variant", "ghost"),
    );
  });

  it("gives the toolbar one tab stop", async () => {
    const { getByRole } = await drawn({}, BAR);

    expect(
      [getByRole("button", { name: "Zoom in" }), getByRole("button", { name: "Zoom out" })].map(
        (button) => button.tabIndex,
      ),
    ).toStrictEqual([0, -1]);
  });

  it("moves focus to the next control on ArrowRight", async () => {
    const { getByRole } = await drawn({}, BAR);

    act(() => {
      getByRole("button", { name: "Zoom in" }).focus();
    });
    fireEvent.keyDown(getByRole("button", { name: "Zoom in" }), { key: "ArrowRight" });

    expect(document.activeElement).toBe(getByRole("button", { name: "Zoom out" }));
  });

  it("keeps a Delete pressed on a control from removing the selection", async () => {
    const onNodesDelete = vi.fn<NonNullable<Graph.CanvasProps["onNodesDelete"]>>();
    const { getByRole } = await drawn({ nodes: SELECTED, onNodesDelete }, BAR);

    fireEvent.keyDown(getByRole("button", { name: "Zoom in" }), { code: "Delete", key: "Delete" });
    await settled();

    expect(onNodesDelete).not.toHaveBeenCalled();
  });
});
