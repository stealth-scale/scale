import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { recipeClasses } from "@stealthscale/testing-theme";

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

  it("runs the cells across in a row that wraps until a caller asks for a column", () => {
    expect(recipeClasses(drawn(), "stack")).toContain("stack--row");
    expect(recipeClasses(drawn(), "stack")).toContain("stack--wrap");
  });

  it("runs the cells down when a caller asks for a column", () => {
    const { container } = render(
      <Matrix direction="column" of={SIZES}>
        {(size) => <span>{size}</span>}
      </Matrix>,
    );

    expect(recipeClasses(container, "stack")).not.toContain("stack--row");
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

  it("captions each row with the first axis and each cell in it with the second", () => {
    expect(crossed().textContent).toBe(
      "variant = solidsize = smsolid smsize = mdsolid mdsize = lgsolid lgvariant = ghostsize = smghost smsize = mdghost mdsize = lgghost lg",
    );
  });

  it("breaks no accessibility rule", async () => {
    await expect(
      accessibilityViolations(Matrix, {
        props: { children: (size: string) => <span>{size}</span>, of: SIZES },
      }),
    ).resolves.toStrictEqual([]);
  });
});
