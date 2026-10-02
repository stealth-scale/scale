import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { accessibilityViolations } from "@stealthscale/testing-react";
import { recipeClasses, recipeElement } from "@stealthscale/testing-theme";

import { SkeletonText } from "#skeleton-text/skeleton-text.tsx";

describe("SkeletonText", () => {
  it("returns no accessibility violation", async () => {
    await expect(accessibilityViolations(SkeletonText)).resolves.toStrictEqual([]);
  });

  it("renders three bars when lines is absent", () => {
    const { container } = render(<SkeletonText />);

    expect(recipeElement(container, "skeleton-text").children).toHaveLength(3);
  });

  it("renders one bar per line", () => {
    const { container } = render(<SkeletonText lines={6} />);

    expect(recipeElement(container, "skeleton-text").children).toHaveLength(6);
  });

  it("renders one bar when lines is below one", () => {
    const { container } = render(<SkeletonText lines={0} />);

    expect(recipeElement(container, "skeleton-text").children).toHaveLength(1);
  });

  it("applies motion to every bar", () => {
    const { container } = render(<SkeletonText lines={2} motion="shimmer" />);

    for (const bar of recipeElement(container, "skeleton-text").children) {
      expect(bar.className).toContain("shimmer");
    }
  });

  it("applies radius to every bar", () => {
    const { container } = render(<SkeletonText lines={2} radius="full" />);

    for (const bar of recipeElement(container, "skeleton-text").children) {
      expect(bar.className).toContain("full");
    }
  });

  it("renders the element passed as as", () => {
    const { container } = render(<SkeletonText as="section" />);

    expect(recipeElement(container, "skeleton-text").tagName).toBe("SECTION");
  });

  it("applies the skeleton-text class to the column", () => {
    const { container } = render(<SkeletonText />);

    expect(recipeClasses(container, "skeleton-text")).toContain("skeleton-text");
  });
});
