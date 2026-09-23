import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { slotClasses, slotVariantClass } from "@stealthscale/testing-theme";

import { grounded } from "#sample/grounded.tsx";

describe("grounded", () => {
  it("renders the inverted tone in the inverted look", () => {
    const { container } = render(<>{grounded("inverted", "Publish")}</>);

    expect(slotClasses(container, "sample", "body")).toContain(
      slotVariantClass("sample", "body", "variant", "inverted"),
    );
  });

  it("returns any other tone unchanged", () => {
    const { container } = render(<>{grounded("muted", "Publish")}</>);

    expect(container.innerHTML).toBe("Publish");
  });
});
