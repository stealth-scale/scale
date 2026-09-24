import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotElement } from "@stealthscale/testing-theme";

import { Empty } from "#sidebar/empty.ts";
import { blocked } from "#sidebar/sidebar.fixtures.tsx";

describe("Empty", () => {
  it("renders a paragraph inside a block", () => {
    const { container } = render(blocked(<Empty>No projects match</Empty>));

    expect(slotElement(container, "sidebar", "empty").tagName).toBe("P");
  });

  it("renders its message", () => {
    const { container } = render(blocked(<Empty>No projects match</Empty>));

    expect(slotElement(container, "sidebar", "empty").textContent).toBe("No projects match");
  });
});
