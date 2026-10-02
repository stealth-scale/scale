import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn, settled } from "@stealthscale/testing-react";

import { bare, LABEL, labelled } from "#progress-circle/progress-circle.fixtures.tsx";

describe("Label", () => {
  it("renders a span", async () => {
    await drawn(labelled({ value: 62 }));

    expect(screen.getByText(LABEL).tagName).toBe("SPAN");
  });

  it("names the ring while it is mounted", async () => {
    await drawn(labelled({ value: 62 }));

    expect(screen.getByRole("progressbar").getAttribute("aria-labelledby")).toBe(
      screen.getByText(LABEL).id,
    );
  });

  it("leaves the ring unnamed by it once it is unmounted", async () => {
    const { rerender } = await drawn(labelled({ value: 62 }));

    rerender(bare({ value: 62 }));
    await settled();

    expect(screen.getByRole("progressbar").getAttribute("aria-labelledby")).toBeNull();
  });
});
