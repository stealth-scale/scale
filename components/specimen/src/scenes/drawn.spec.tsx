import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { Drawn } from "#scenes/drawn.tsx";

describe("Drawn", () => {
  it("draws a cell per value of the axis", async () => {
    const { getAllByRole } = await drawn(
      <Drawn
        cell={(value) => <button type="button">{String(value)}</button>}
        knob="size"
        of={["sm", "md"]}
      />,
    );

    expect(getAllByRole("button").map((one) => one.textContent)).toStrictEqual(["sm", "md"]);
  });

  it("captions each cell with the axis it turns and the value", async () => {
    const { container } = await drawn(
      <Drawn cell={() => <span>{"cell"}</span>} knob="size" of={["sm"]} />,
    );

    expect(container.querySelector(".sample__caption")?.textContent).toBe("size = sm");
  });

  it("draws a cell per pair where a second axis crosses", async () => {
    const { getAllByText } = await drawn(
      <Drawn
        across={{ knob: "radius", of: ["l1", "l2"] }}
        cell={(value, other) => <span>{`${String(value)}/${String(other)}`}</span>}
        knob="size"
        of={["sm", "md"]}
      />,
    );

    expect(getAllByText(/\//u)).toHaveLength(4);
  });

  it("hands the cell the value of the axis and of whatever crosses it", async () => {
    const { getByText } = await drawn(
      <Drawn
        across={{ knob: "radius", of: ["l1"] }}
        cell={(value, other) => <span>{`${String(value)}/${String(other)}`}</span>}
        knob="size"
        of={["sm"]}
      />,
    );

    expect(getByText("sm/l1")).toBeDefined();
  });
});
