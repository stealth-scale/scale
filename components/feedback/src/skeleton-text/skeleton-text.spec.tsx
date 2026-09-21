import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { recipeClasses, recipeElement } from "@stealthscale/testing-theme";

import { SkeletonText } from "#skeleton-text/skeleton-text.tsx";

describe("SkeletonText", () => {
  it("reports no axe violation on its own", async () => {
    await expect(accessibilityViolations(SkeletonText)).resolves.toStrictEqual([]);
  });

  it("renders three bars when lines is omitted", () => {
    const { container } = render(<SkeletonText />);

    expect(recipeElement(container, "skeleton-text").children).toHaveLength(3);
  });

  it("renders one bar per line when lines is given", () => {
    const { container } = render(<SkeletonText lines={6} />);

    expect(recipeElement(container, "skeleton-text").children).toHaveLength(6);
  });

  it("clamps a lines value below one up to a single bar", () => {
    const { container } = render(<SkeletonText lines={0} />);

    expect(recipeElement(container, "skeleton-text").children).toHaveLength(1);
  });

  it("passes the motion it was given down to every bar", () => {
    const { container } = render(<SkeletonText lines={2} motion="shimmer" />);

    for (const bar of recipeElement(container, "skeleton-text").children) {
      expect(bar.className).toContain("shimmer");
    }
  });

  it("passes the radius it was given down to every bar", () => {
    const { container } = render(<SkeletonText lines={2} radius="full" />);

    for (const bar of recipeElement(container, "skeleton-text").children) {
      expect(bar.className).toContain("full");
    }
  });

  it("renders the element named by as instead of a div", () => {
    const { container } = render(<SkeletonText as="section" />);

    expect(recipeElement(container, "skeleton-text").tagName).toBe("SECTION");
  });

  it("applies the skeleton-text class to the column", () => {
    const { container } = render(<SkeletonText />);

    expect(recipeClasses(container, "skeleton-text")).toContain("skeleton-text");
  });
});
