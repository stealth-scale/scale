import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { variantClass } from "@stealthscale/testing-theme";

import { barsOf, CHANGES, measured, RUN } from "#spark/spark.fixtures.ts";
import { Sparkbar } from "#sparkbar/sparkbar.tsx";

describe("Sparkbar", () => {
  it("returns no accessibility violation", async () => {
    measured();

    await expect(
      accessibilityViolations(() => <Sparkbar label="Sign-ups this week" values={RUN} />),
    ).resolves.toStrictEqual([]);
  });

  it("renders a bar per value", () => {
    measured();

    const { container } = render(<Sparkbar values={[3, 5, 2]} />);

    expect(barsOf(container)).toHaveLength(3);
  });

  it("leaves the period of a missing value empty", () => {
    measured();

    const { container } = render(<Sparkbar values={RUN} />);

    expect(barsOf(container)).toHaveLength(6);
  });

  it("measures every bar's length from zero", () => {
    measured();

    const [, five, two] = barsOf(render(<Sparkbar values={[3, 5, 2]} />).container);

    expect((five?.height ?? 0) / (two?.height ?? 1)).toBeCloseTo(2.5, 1);
  });

  it("colors the bars with the theme's first series color unless stated", () => {
    measured();

    const { container } = render(<Sparkbar values={[3, 5]} />);

    expect(barsOf(container)[0]?.fill).toBe("var(--colors-series-1)");
  });

  it("colors the bars with the chart color of the palette color names", () => {
    measured();

    const { container } = render(<Sparkbar color="teal" values={[3, 5]} />);

    expect(barsOf(container)[0]?.fill).toBe("var(--colors-teal-chart)");
  });

  it("colors a fall with the error palette's chart color when signed", () => {
    measured();

    const { container } = render(<Sparkbar signed values={CHANGES} />);

    expect(barsOf(container)[1]?.fill).toBe("var(--colors-error-chart)");
  });

  it("colors a fall like any bar without signed", () => {
    measured();

    const { container } = render(<Sparkbar values={CHANGES} />);

    expect(barsOf(container)[1]?.fill).toBe("var(--colors-series-1)");
  });

  it("names a run with a label as an image", () => {
    measured();

    const { getByRole } = render(<Sparkbar label="Sign-ups this week" values={RUN} />);

    expect(getByRole("img", { name: "Sign-ups this week" })).toBeDefined();
  });

  it("hides a run without a label from assistive technology", () => {
    measured();

    const { container } = render(<Sparkbar values={RUN} />);

    expect(container.querySelector(".spark")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("takes no tab stop", () => {
    measured();

    const { container } = render(<Sparkbar label="Sign-ups this week" values={RUN} />);

    expect(container.querySelector("[tabindex='0']")).toBeNull();
  });

  it("marks the baseline with a dashed line", () => {
    measured();

    const { container } = render(<Sparkbar baseline={20} values={RUN} />);

    expect(
      container.querySelector(".recharts-reference-line line")?.getAttribute("stroke-dasharray"),
    ).toBe("2 2");
  });

  it("applies the size's class", () => {
    measured();

    const { container } = render(<Sparkbar size="lg" values={RUN} />);

    expect(container.querySelector(".spark")?.className).toContain(
      variantClass("spark", "size", "lg"),
    );
  });
});
