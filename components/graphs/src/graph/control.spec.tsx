import { fireEvent } from "@testing-library/react";
import { MaximizeIcon, MinusIcon, PlusIcon } from "lucide-react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "#graph/graph.fixtures.tsx";
import * as Graph from "#graph/index.ts";

const BAR = (
  <Graph.Controls>
    <Graph.Control action="zoomIn" label="Zoom in">
      <PlusIcon />
    </Graph.Control>
    <Graph.Control action="zoomOut" label="Zoom out">
      <MinusIcon />
    </Graph.Control>
    <Graph.Control action="fit" label="Fit">
      <MaximizeIcon />
    </Graph.Control>
    <Graph.ZoomLevel />
  </Graph.Controls>
);

describe("Control", () => {
  it("renders a button named by label", async () => {
    const { getByRole } = await drawn({}, BAR);

    expect(getByRole("button", { name: "Zoom in" }).tagName).toBe("BUTTON");
  });

  it("renders the caller's glyph in the button", async () => {
    const { getByRole } = await drawn({}, BAR);

    expect(getByRole("button", { name: "Zoom in" }).querySelector("svg")).not.toBeNull();
  });

  it("zooms the view in by a fifth when zoomIn is pressed", async () => {
    const { getByRole } = await drawn({}, BAR);

    fireEvent.click(getByRole("button", { name: "Zoom in" }));

    expect(getByRole("status").textContent).toBe("120%");
  });

  it("zooms the view out by a fifth when zoomOut is pressed", async () => {
    const { getByRole } = await drawn({}, BAR);

    fireEvent.click(getByRole("button", { name: "Zoom out" }));

    expect(getByRole("status").textContent).toBe("83%");
  });

  it("fits the graph in view when fit is pressed", async () => {
    const { getByRole } = await drawn({}, BAR);

    fireEvent.click(getByRole("button", { name: "Zoom in" }));
    fireEvent.click(getByRole("button", { name: "Fit" }));
    await settled();

    expect(getByRole("status").textContent).toBe("100%");
  });
});
