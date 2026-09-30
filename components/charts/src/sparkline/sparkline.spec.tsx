import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { variantClass } from "@stealthscale/testing-theme";

import { measured, RUN } from "#spark/spark.fixtures.ts";
import { Sparkline } from "#sparkline/sparkline.tsx";

/**
 * Returns the path data of the run's line inside a container.
 */
function lineOf(container: Element): string {
  return container.querySelector(".recharts-area-curve")?.getAttribute("d") ?? "";
}

/**
 * Returns the y coordinate of every point the line passes through, read from its path.
 */
function heightsOf(container: Element): number[] {
  return [...lineOf(container).matchAll(/[ML]\s*-?[\d.]+,\s*(-?[\d.]+)/gu)].map((match) =>
    Number(match[1]),
  );
}

describe("Sparkline", () => {
  it("returns no accessibility violation", async () => {
    measured();

    await expect(
      accessibilityViolations(() => <Sparkline label="Sign-ups this week" values={RUN} />),
    ).resolves.toStrictEqual([]);
  });

  it("renders the run as a line", () => {
    measured();

    const { container } = render(<Sparkline values={[3, 5, 2]} />);

    expect(lineOf(container)).not.toBe("");
  });

  it("breaks the line at a missing value", () => {
    measured();

    const { container } = render(<Sparkline curve="linear" values={RUN} />);

    expect(lineOf(container).match(/M/gu)).toHaveLength(2);
  });

  it("spans the run's own range from the top of the box to the bottom", () => {
    measured();

    const heights = heightsOf(render(<Sparkline curve="linear" values={[40, 45, 42]} />).container);

    expect([Math.min(...heights), Math.max(...heights)]).toStrictEqual([1, 23]);
  });

  it("widens the range to include the baseline", () => {
    measured();

    const heights = heightsOf(
      render(<Sparkline baseline={30} curve="linear" values={[40, 45, 42]} />).container,
    );

    expect(Math.max(...heights)).toBeLessThan(23);
  });

  it("marks the baseline with a dashed line", () => {
    measured();

    const { container } = render(<Sparkline baseline={30} values={[40, 45, 42]} />);

    expect(
      container.querySelector(".recharts-reference-line line")?.getAttribute("stroke-dasharray"),
    ).toBe("2 2");
  });

  it("renders straight lines between the values with a linear curve", () => {
    measured();

    const { container } = render(<Sparkline curve="linear" values={[3, 5, 2]} />);

    expect(lineOf(container)).not.toContain("C");
  });

  it("smooths the line between the values unless stated", () => {
    measured();

    const { container } = render(<Sparkline values={[3, 5, 2]} />);

    expect(lineOf(container)).toContain("C");
  });

  it("colors the line with the theme's first series color unless stated", () => {
    measured();

    const { container } = render(<Sparkline values={[3, 5, 2]} />);

    expect(container.querySelector(".recharts-area-curve")?.getAttribute("stroke")).toBe(
      "var(--colors-series-1)",
    );
  });

  it("colors the line with the chart color of the palette color names", () => {
    measured();

    const { container } = render(<Sparkline color="success" values={[3, 5, 2]} />);

    expect(container.querySelector(".recharts-area-curve")?.getAttribute("stroke")).toBe(
      "var(--colors-success-chart)",
    );
  });

  it("fills under the line with the gradient it renders when area is set", () => {
    measured();

    const { container } = render(<Sparkline area values={[3, 5, 2]} />);
    const gradient = container.querySelector("defs linearGradient")?.id ?? "missing";

    expect(container.querySelector(".recharts-area-area")?.getAttribute("fill")).toBe(
      `url(#${gradient})`,
    );
  });

  it("fills nothing under the line unless area is set", () => {
    measured();

    const { container } = render(<Sparkline values={[3, 5, 2]} />);

    expect(container.querySelector(".recharts-area-area")?.getAttribute("fill")).toBe("none");
  });

  it("names a run with a label as an image", () => {
    measured();

    const { getByRole } = render(<Sparkline label="Sign-ups this week" values={RUN} />);

    expect(getByRole("img", { name: "Sign-ups this week" })).toBeDefined();
  });

  it("hides a run without a label from assistive technology", () => {
    measured();

    const { container } = render(<Sparkline values={RUN} />);

    expect(container.querySelector(".spark")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("takes no tab stop", () => {
    measured();

    const { container } = render(<Sparkline label="Sign-ups this week" values={RUN} />);

    expect(container.querySelector("[tabindex='0']")).toBeNull();
  });

  it("applies the stretch class when stretch is set", () => {
    measured();

    const { container } = render(<Sparkline stretch values={RUN} />);

    expect(container.querySelector(".spark")?.className).toContain(
      variantClass("spark", "stretch", "true"),
    );
  });
});
