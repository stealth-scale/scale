import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { listed } from "#nav-list/nav-list.fixtures.tsx";
import { Skeleton } from "#nav-list/skeleton.ts";

describe("Skeleton", () => {
  it("renders an LI element inside a list", () => {
    const { container } = render(listed(<Skeleton />));

    expect(slotElement(container, "nav-list", "skeleton").tagName).toBe("LI");
  });

  it("renders no child element when the caller passes none", () => {
    const { container } = render(listed(<Skeleton />));

    expect(slotElement(container, "nav-list", "skeleton").children).toHaveLength(0);
  });
});
