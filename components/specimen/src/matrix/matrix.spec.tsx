import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { Matrix } from "#matrix/matrix.tsx";

const SIZES = ["sm", "md", "lg"] as const;

const LOOKS = ["solid", "ghost"] as const;

function drawn(knob?: string): HTMLElement {
  return render(
    <Matrix knob={knob} of={SIZES}>
      {(size) => <button type="button">{size}</button>}
    </Matrix>,
  ).container;
}

function crossed(): HTMLElement {
  return render(
    <Matrix across={{ knob: "size", of: SIZES }} knob="variant" of={LOOKS}>
      {(look, size) => (
        <button type="button">
          {look} {size}
        </button>
      )}
    </Matrix>,
  ).container;
}

describe("Matrix", () => {
  it("draws one cell per value of the axis", () => {
    expect(drawn().querySelectorAll("button")).toHaveLength(3);
  });

  it("captions each cell with the value it was drawn for", () => {
    expect(drawn().textContent).toBe("smsmmdmdlglg");
  });

  it("writes the prop before each value when the axis names one", () => {
    expect(drawn("size").textContent).toContain("size = sm");
  });

  it("draws the cells in the order the axis lists them", () => {
    const labels = [...drawn().querySelectorAll("button")].map((held) => held.textContent);

    expect(labels).toStrictEqual(["sm", "md", "lg"]);
  });

  it("names a value through the label the axis states", () => {
    const { container } = render(
      <Matrix label={(size: string) => size.toUpperCase()} of={SIZES}>
        {(size) => <span>{size}</span>}
      </Matrix>,
    );

    expect(container.textContent).toContain("SM");
  });

  it("draws nothing for an axis holding no value", () => {
    const { container } = render(<Matrix of={[]}>{(size: string) => <span>{size}</span>}</Matrix>);

    expect(container.textContent).toBe("");
  });

  it("lays the cells on equal columns of the smallest measure until a caller says otherwise", () => {
    expect(slotClasses(drawn(), "grid", "root")).toContain(
      slotVariantClass("grid", "root", "columns", "fill-xs"),
    );
    expect(slotClasses(drawn(), "sample", "root")).toContain("sample__root");
  });

  it("runs the cells down one column when a caller asks for a column", () => {
    const { container } = render(
      <Matrix direction="column" of={SIZES}>
        {(size) => <span>{size}</span>}
      </Matrix>,
    );

    expect(slotClasses(container, "grid", "root")).toContain(
      slotVariantClass("grid", "root", "columns", "1"),
    );
  });

  it("takes the columns a caller asks for over either", () => {
    const { container } = render(
      <Matrix columns="2" direction="column" of={SIZES}>
        {(size) => <span>{size}</span>}
      </Matrix>,
    );

    expect(slotClasses(container, "grid", "root")).toContain(
      slotVariantClass("grid", "root", "columns", "2"),
    );
  });

  it("hands the grid the count of values running across", () => {
    expect(slotClasses(crossed(), "matrix", "grid")).toContain(
      slotVariantClass("matrix", "grid", "across", "3"),
    );
  });

  it("crosses two axes into one cell per pair", () => {
    const labels = [...crossed().querySelectorAll("button")].map((held) => held.textContent);

    expect(labels).toStrictEqual([
      "solid sm",
      "solid md",
      "solid lg",
      "ghost sm",
      "ghost md",
      "ghost lg",
    ]);
  });

  it("captions the second axis along the top and the first down the side", () => {
    const container = crossed();
    const [top, ...rows] = [...(container.querySelector(".matrix__grid")?.children ?? [])];

    expect(top?.textContent).toBe("size = smsize = mdsize = lg");
    expect(rows.map((one) => one.firstElementChild?.textContent)).toStrictEqual([
      "variant = solid",
      "variant = ghost",
    ]);
  });

  it("carries the top edge's caption in every cell, for the rows once folded", () => {
    const cells = [...crossed().querySelectorAll("button")].map((held) =>
      held.closest(".matrix__cell"),
    );

    expect(cells.map((held) => held?.firstElementChild?.textContent)).toStrictEqual([
      "size = sm",
      "size = md",
      "size = lg",
      "size = sm",
      "size = md",
      "size = lg",
    ]);
    expect(slotClasses(crossed(), "matrix", "label")).toContain("matrix__label");
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Matrix, {
        props: { children: (size: string) => <span>{size}</span>, of: SIZES },
      }),
    ).resolves.toStrictEqual([]);
  });
});
