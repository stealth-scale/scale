import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { charted } from "#chart/chart.fixtures.tsx";
import { type Mark, marksOf } from "#chord-diagram/marks.ts";
import { Readout } from "#chord-diagram/readout.tsx";

const MARKS = marksOf(
  [
    { key: "a", label: "Alpha" },
    { key: "b", label: "Beta" },
  ],
  [
    { from: "a", to: "b", value: 60 },
    { from: "b", to: "a", value: 20 },
  ],
);

function readout(mark?: Mark): HTMLElement {
  return render(
    charted({
      children: (
        <svg>
          <Readout
            area={{ height: 300, width: 400, x: 5, y: 10 }}
            mark={mark}
            words={{ inflow: "In", outflow: "Out" }}
            write={(value) => `#${String(value)}`}
          />
        </svg>
      ),
    }),
  ).container;
}

function rows(container: HTMLElement): readonly string[] {
  return [...container.querySelectorAll(".chart__row")].map(
    (row) =>
      `${row.querySelector(".chart__name")?.textContent ?? ""}=${row.querySelector(".chart__value")?.textContent ?? ""}`,
  );
}

describe("Readout", () => {
  it("covers the plot's box", () => {
    const box = readout().querySelector("foreignObject");

    expect(["x", "y", "width", "height"].map((name) => box?.getAttribute(name))).toStrictEqual([
      "5",
      "10",
      "400",
      "300",
    ]);
  });

  it("lets the pointer through to the ribbons", () => {
    expect(readout().querySelector("foreignObject")?.getAttribute("pointer-events")).toBe("none");
  });

  it("renders the tooltip inside the plot's center part", () => {
    expect(readout().querySelector(".chart__center > .chart__tooltip")?.tagName).toBe("OUTPUT");
  });

  it("keeps an empty tooltip while it is at no mark", () => {
    expect(readout().querySelector(".chart__tooltip")?.childElementCount).toBe(0);
  });

  it("announces the tooltip assertively", () => {
    expect(readout().querySelector(".chart__tooltip")?.getAttribute("aria-live")).toBe("assertive");
  });

  it("heads the tooltip with the mark it is at", () => {
    expect(readout(MARKS[1]).querySelector(".chart__heading")?.textContent).toBe("Alpha ⇄ Beta");
  });

  it("writes the rows of the mark it is at", () => {
    expect(rows(readout(MARKS[0]))).toStrictEqual(["Out=#60", "In=#20"]);
  });
});
