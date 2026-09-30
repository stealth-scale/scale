import { isValidElement } from "react";

import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { drawn, EDGES, NODES } from "#graph/graph.fixtures.tsx";
import * as Graph from "#graph/index.ts";
import { layoutGraph } from "#layout/rank.ts";

function mapProps(): unknown {
  const { props } = Graph.MiniMap({});

  if (typeof props !== "object" || props === null || !("children" in props)) return undefined;

  return isValidElement(props.children) ? props.children.props : undefined;
}

describe("MiniMap", () => {
  it("renders an overview named Overview unless labelled", async () => {
    const { getByRole } = await drawn({}, <Graph.MiniMap />);

    expect(getByRole("img", { name: "Overview" })).toBeDefined();
  });

  it("names the overview by label", async () => {
    const { getByRole } = await drawn({}, <Graph.MiniMap label="Overview of the pipeline" />);

    expect(getByRole("img", { name: "Overview of the pipeline" })).toBeDefined();
  });

  it("renders React Flow's minimap in the recipe's overview box", async () => {
    const { container } = await drawn({}, <Graph.MiniMap />);

    expect(
      slotElement(container, "graph", "overview").querySelector(".react-flow__minimap"),
    ).not.toBeNull();
  });

  it("passes the caller's props to React Flow's minimap", async () => {
    const { container } = await drawn({}, <Graph.MiniMap position="top-left" />);

    expect([...(container.querySelector(".react-flow__minimap")?.classList ?? [])]).toStrictEqual(
      expect.arrayContaining(["top", "left"]),
    );
  });

  it("shows every node layoutGraph placed", async () => {
    const { container } = await drawn({ nodes: layoutGraph(NODES, EDGES) }, <Graph.MiniMap />);

    expect(container.querySelectorAll(".react-flow__minimap-node")).toHaveLength(3);
  });

  it("lets a pointer dragging the overview pan the canvas", () => {
    expect(mapProps()).toMatchObject({ pannable: true });
  });

  it("lets the wheel over the overview zoom the canvas", () => {
    expect(mapProps()).toMatchObject({ zoomable: true });
  });
});
