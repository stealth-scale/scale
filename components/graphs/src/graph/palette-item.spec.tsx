import { act, fireEvent, render } from "@testing-library/react";
import { type XYPosition } from "@xyflow/react";
import { describe, expect, it, vi } from "vitest";

import { ITEM } from "#graph/drop.ts";
import { drawn, NODES } from "#graph/graph.fixtures.tsx";
import * as Graph from "#graph/index.ts";

type OnAdd = (item: string, position: XYPosition) => void;

function item(onAdd: OnAdd = vi.fn<OnAdd>()): ReturnType<typeof drawn> {
  return drawn(
    { fitView: false, nodes: NODES },
    <Graph.PaletteItem item="judge" onAdd={onAdd}>
      Add a judge
    </Graph.PaletteItem>,
  );
}

describe("PaletteItem", () => {
  it("renders a button named by its words", async () => {
    const { getByRole } = await item();

    expect(getByRole("button", { name: "Add a judge" }).tagName).toBe("BUTTON");
  });

  it("makes the item draggable", async () => {
    const { getByRole } = await item();

    expect(getByRole("button", { name: "Add a judge" }).getAttribute("draggable")).toBe("true");
  });

  it("writes its id under the kit's type when a drag starts", async () => {
    const { getByRole } = await item();
    const setData = vi.fn<(type: string, data: string) => void>();

    fireEvent.dragStart(getByRole("button", { name: "Add a judge" }), {
      dataTransfer: { setData },
    });

    expect(setData.mock.lastCall).toStrictEqual([ITEM, "judge"]);
  });

  it("adds its item at the middle of the view when pressed", async () => {
    const onAdd = vi.fn<OnAdd>();
    const { getByRole } = await item(onAdd);

    fireEvent.click(getByRole("button", { name: "Add a judge" }));

    expect(onAdd.mock.lastCall).toStrictEqual(["judge", { x: 320, y: 180 }]);
  });

  it("adds its item at the graph's origin while no canvas renders", () => {
    const onAdd = vi.fn<OnAdd>();
    const { getByRole } = render(
      <Graph.Root>
        <Graph.PaletteItem item="judge" onAdd={onAdd}>
          Add a judge
        </Graph.PaletteItem>
      </Graph.Root>,
    );

    act(() => {
      fireEvent.click(getByRole("button", { name: "Add a judge" }));
    });

    expect(onAdd.mock.lastCall).toStrictEqual(["judge", { x: 0, y: 0 }]);
  });
});
