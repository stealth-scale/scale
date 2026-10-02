import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { drawn } from "@stealthscale/testing-react";

import { bare, LABEL, labelled } from "#progress-circle/progress-circle.fixtures.tsx";

describe("Circle", () => {
  it("renders an svg in the progressbar role", async () => {
    await drawn(labelled({ value: 62 }));

    expect(screen.getByRole("progressbar").tagName.toLowerCase()).toBe("svg");
  });

  it("is named by the label while one renders", async () => {
    await drawn(labelled({ value: 62 }));

    expect(screen.getByRole("progressbar", { name: LABEL })).toBeDefined();
  });

  it("is named by aria-label without a label", async () => {
    await drawn(bare({ value: 62 }));

    expect(screen.getByRole("progressbar", { name: LABEL })).toBeDefined();
  });

  it("leaves out aria-labelledby without a label", async () => {
    await drawn(bare({ value: 62 }));

    expect(screen.getByRole("progressbar").getAttribute("aria-labelledby")).toBeNull();
  });

  it("states the formatted value as aria-valuetext", async () => {
    await drawn(labelled({ value: 62 }));

    expect(screen.getByRole("progressbar").getAttribute("aria-valuetext")).toBe("62%");
  });

  it("states no value while the value is unknown", async () => {
    await drawn(labelled({ value: null }));

    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBeNull();
  });

  it("marks an unknown value for the recipe to turn", async () => {
    await drawn(labelled({ value: null }));

    expect(screen.getByRole("progressbar").dataset["state"]).toBe("indeterminate");
  });
});
