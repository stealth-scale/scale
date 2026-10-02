import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { composed, star } from "#rating-group/rating-group.fixtures.tsx";

describe("Label", () => {
  it("renders a span", async () => {
    await drawn(composed());

    expect(screen.getByText("Your stay").tagName).toBe("SPAN");
  });

  it("points at no input", async () => {
    await drawn(composed());

    expect(screen.getByText("Your stay").hasAttribute("for")).toBe(false);
  });

  it("names the group while it is mounted", async () => {
    await drawn(composed());

    expect(screen.getByRole("radiogroup").getAttribute("aria-labelledby")).toBe(
      screen.getByText("Your stay").id,
    );
  });

  it("leaves the group unnamed by it once it is unmounted", async () => {
    const { rerender } = await drawn(composed());

    rerender(composed({}, { labelled: false }));
    await settled();

    expect(screen.getByRole("radiogroup").getAttribute("aria-labelledby")).toBeNull();
  });

  it("focuses the rated item on a press", async () => {
    await drawn(composed({ defaultValue: 3 }));
    fireEvent.click(screen.getByText("Your stay"));
    await settled();

    expect(document.activeElement).toBe(star("3 stars"));
  });
});
