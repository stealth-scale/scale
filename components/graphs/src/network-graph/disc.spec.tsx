import { ServerIcon } from "lucide-react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { nodeOf } from "#graph/graph.fixtures.tsx";
import { linked, NODES } from "#network-graph/network-graph.fixtures.tsx";

function discOf(container: HTMLElement, name: string): HTMLElement {
  return slotElement(nodeOf(container, name), "graph", "disc");
}

describe("Disc", () => {
  it("renders the node's name under the disc", async () => {
    const { container } = await linked();

    expect(slotElement(nodeOf(container, "Checkout"), "graph", "discLabel").textContent).toBe(
      "Checkout",
    );
  });

  it("sizes the disc by --graph-disc in pixels", async () => {
    const { container } = await linked();

    expect(discOf(container, "Gateway").style.getPropertyValue("--graph-disc")).toBe("68px");
  });

  it("hides the disc from assistive technology", async () => {
    const { container } = await linked();

    expect(discOf(container, "Gateway").getAttribute("aria-hidden")).toBe("true");
  });

  it("renders the node's icon in the disc", async () => {
    const { container } = await linked({
      nodes: [{ icon: <ServerIcon />, id: "gateway", label: "Gateway" }, ...NODES.slice(1)],
    });

    expect(discOf(container, "Gateway").querySelector("svg")).not.toBeNull();
  });

  it("puts both handles in the disc's hub", async () => {
    const { container } = await linked();
    const hub = slotElement(nodeOf(container, "Gateway"), "graph", "discHub");

    expect(
      [...hub.querySelectorAll(".react-flow__handle")].map((handle) =>
        handle.classList.contains("source") ? "source" : "target",
      ),
    ).toStrictEqual(["target", "source"]);
  });

  it("places both handles on the hub's top", async () => {
    const { container } = await linked();
    const handles = [
      ...nodeOf(container, "Gateway").querySelectorAll<HTMLElement>(".react-flow__handle"),
    ];

    expect(handles.map((handle) => handle.dataset["handlepos"])).toStrictEqual(["top", "top"]);
  });

  it("makes no handle take connections", async () => {
    const { container } = await linked();

    expect(
      nodeOf(container, "Gateway").querySelectorAll(".react-flow__handle.connectable"),
    ).toHaveLength(0);
  });

  it("marks a node outside the focus's reach dimmed", async () => {
    const { container } = await linked({ defaultFocus: "checkout" });

    expect(slotElement(nodeOf(container, "Fax"), "graph", "discNode").dataset["dimmed"]).toBe("");
  });

  it("marks no lit node dimmed", async () => {
    const { container } = await linked({ defaultFocus: "checkout" });

    expect(
      slotElement(nodeOf(container, "Kafka"), "graph", "discNode").dataset["dimmed"],
    ).toBeUndefined();
  });
});
