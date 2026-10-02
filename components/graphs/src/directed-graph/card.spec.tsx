import { DatabaseIcon } from "lucide-react";
import { describe, expect, it } from "vitest";

import { slotClass, slotElement, variantClass } from "@stealthscale/testing-theme";

import { NODES, traced } from "#directed-graph/directed-graph.fixtures.tsx";
import { type DirectedNode } from "#directed-graph/types.ts";
import { keyed, nodeOf, pressed } from "#graph/graph.fixtures.tsx";

const PROMPT = "Select a node to trace what feeds it and what it feeds.";

function patched(patch: Partial<DirectedNode>): DirectedNode[] {
  return [{ id: "orders", kind: "Table", label: "Orders", ...patch }, ...NODES.slice(1)];
}

function branchOf(container: HTMLElement, name: string): HTMLElement {
  const control = slotElement(nodeOf(container, name), "graph", "nodeBranch").querySelector(
    "button",
  );

  if (control === null) throw new Error(`${name} has no branch control.`);

  return control;
}

describe("Card", () => {
  it("renders the node's name in the title slot", async () => {
    const { container } = await traced();

    expect(slotElement(nodeOf(container, "Joined orders"), "graph", "nodeTitle").textContent).toBe(
      "Joined orders",
    );
  });

  it("renders the node's kind in the subtitle slot", async () => {
    const { container } = await traced();

    expect(
      slotElement(nodeOf(container, "Joined orders"), "graph", "nodeSubtitle").textContent,
    ).toBe("Model");
  });

  it("renders the node's detail in the body slot", async () => {
    const { container } = await traced({ nodes: patched({ detail: "12 rows" }) });

    expect(slotElement(nodeOf(container, "Orders"), "graph", "nodeBody").textContent).toBe(
      "12 rows",
    );
  });

  it("renders the node's glyph hidden from assistive technology", async () => {
    const { container } = await traced({ nodes: patched({ icon: <DatabaseIcon /> }) });
    const icon = slotElement(nodeOf(container, "Orders"), "graph", "nodeIcon");

    expect(icon.getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the node's status word", async () => {
    const { container } = await traced({
      nodes: patched({ status: { label: "Stale", palette: "warning" } }),
    });

    expect(slotElement(nodeOf(container, "Orders"), "status", "root").textContent).toBe("Stale");
  });

  it("renders the relation in the tag slot", async () => {
    const { container } = await traced({ defaultFocus: "joined" });

    expect(slotElement(nodeOf(container, "Clean orders"), "graph", "nodeTag").textContent).toBe(
      "Upstream",
    );
  });

  it("hides the relation's badge from assistive technology", async () => {
    const { container } = await traced({ defaultFocus: "joined" });
    const tag = slotElement(nodeOf(container, "Clean orders"), "graph", "nodeTag");

    expect(tag.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });

  it.each([
    { axis: "palette", value: "neutral" },
    { axis: "size", value: "sm" },
    { axis: "variant", value: "surface" },
  ])("renders the relation's badge with $axis $value", async ({ axis, value }) => {
    const { container } = await traced({ defaultFocus: "joined" });
    const tag = slotElement(nodeOf(container, "Clean orders"), "graph", "nodeTag");

    expect(tag.firstElementChild?.classList).toContain(variantClass("badge", axis, value));
  });

  it.each([
    { axis: "palette", value: "neutral" },
    { axis: "size", value: "xs" },
    { axis: "variant", value: "surface" },
  ])("renders the branch control with $axis $value", async ({ axis, value }) => {
    const { container } = await traced({ collapsible: true });

    expect(branchOf(container, "Joined orders").classList).toContain(
      variantClass("button", axis, value),
    );
  });

  it("renders no tag on an unrelated node", async () => {
    const { container } = await traced({ defaultFocus: "joined" });

    expect(
      nodeOf(container, "Web logs").querySelector(`.${slotClass("graph", "nodeTag")}`),
    ).toBeNull();
  });

  it("dims an unrelated card while the trace highlights", async () => {
    const { container } = await traced({ defaultFocus: "joined" });

    expect(slotElement(nodeOf(container, "Web logs"), "graph", "node").dataset["dimmed"]).toBe("");
  });

  it("renders a port no edge meets unused", async () => {
    const { container } = await traced();
    const port = nodeOf(container, "Orders").querySelector<HTMLElement>(
      ".react-flow__handle.target",
    );

    expect(port?.dataset["unused"]).toBe("");
  });

  it("renders no branch control while the graph is not collapsible", async () => {
    const { container } = await traced();

    expect(
      nodeOf(container, "Joined orders").querySelector(`.${slotClass("graph", "nodeBranch")}`),
    ).toBeNull();
  });

  it("renders the branch control with the number of nodes a press hides", async () => {
    const { container } = await traced({ collapsible: true });

    expect(branchOf(container, "Joined orders").textContent).toBe("Hide 2");
  });

  it("marks an open branch's control expanded", async () => {
    const { container } = await traced({ collapsible: true });

    expect(branchOf(container, "Joined orders").getAttribute("aria-expanded")).toBe("true");
  });

  it("marks a closed branch's control collapsed", async () => {
    const { container } = await traced({ collapsible: true, defaultCollapsed: ["joined"] });

    expect(branchOf(container, "Joined orders").getAttribute("aria-expanded")).toBe("false");
  });

  it("opens the branch when its control is pressed", async () => {
    const { container } = await traced({ collapsible: true, defaultCollapsed: ["joined"] });

    await pressed(branchOf(container, "Joined orders"));

    expect(nodeOf(container, "Revenue").dataset["id"]).toBe("revenue");
  });

  it("keeps the focus when the branch control is pressed", async () => {
    const { container, getByRole } = await traced({ collapsible: true });

    await pressed(branchOf(container, "Joined orders"));

    expect(getByRole("status").textContent).toBe(PROMPT);
  });

  it("keeps React Flow from acting on Enter on the branch control", async () => {
    const { container, getByRole } = await traced({ collapsible: true });

    await keyed(branchOf(container, "Joined orders"), "Enter");

    expect(getByRole("status").textContent).toBe(PROMPT);
  });
});
